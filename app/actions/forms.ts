"use server";

import { headers } from "next/headers";
import { ContactFormData, FormDataTypes, RecrutementFormData } from "@/types/forms";

const SEATABLE_BASE_URL = process.env.SEATABLE_BASE_URL?.trim() || "https://atelier.benetnath.fr";
const AUTH_TIMEOUT_MS = 15000;
const API_TIMEOUT_MS = 20000;
const DISCORD_TIMEOUT_MS = 10000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const ALLOWED_INTERESTS = new Set([
    "Impression 3D",
    "Software",
    "Textile",
    "Bois",
    "Éléctronique"
]);

export type ActionResult = {
    success: boolean;
    message: string;
    requestId: string;
    retryAfterSeconds?: number;
};

type AppAccessTokenResult =
    | { success: true; data: AppAccessTokenResponse }
    | { success: false; message: string };

type SubmissionValidationResult =
    | {
        success: true;
        tableName: "Contact" | "Inscriptions";
        row: Record<string, unknown>;
        notificationData: ContactFormData | RecrutementFormData;
    }
    | {
        success: false;
        message: string;
    };

const submissionBuckets = new Map<string, { windowStart: number; count: number }>();

function safeString(value: unknown, options: { min?: number; max: number; trim?: boolean; optional?: boolean }): string | null {
    if (typeof value !== "string") {
        return options.optional ? "" : null;
    }

    const normalized = options.trim === false ? value : value.trim();

    if (!options.optional && normalized.length < (options.min ?? 1)) {
        return null;
    }

    if (normalized.length > options.max) {
        return null;
    }

    return normalized;
}

function parsePromotion(value: string): number | null {
    if (!/^\d{4}$/.test(value)) {
        return null;
    }

    const year = Number(value);
    if (!Number.isInteger(year) || year < 2000 || year > 2031) {
        return null;
    }

    return year;
}

function extractAllowedInterests(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return [...new Set(value.filter((interest): interest is string => typeof interest === "string"))]
        .map((interest) => interest.trim())
        .filter((interest) => ALLOWED_INTERESTS.has(interest));
}

function validateSubmission(type: "contact" | "recrutement", data: FormDataTypes): SubmissionValidationResult {
    if (type === "contact") {
        const source = data as Partial<ContactFormData>;
        const name = safeString(source.name, { max: 120 });
        const email = safeString(source.email, { max: 254 });
        const subject = safeString(source.subject, { max: 180 });
        const message = safeString(source.message, { max: 4000 });

        if (!name || !email || !subject || !message) {
            return { success: false, message: "Le formulaire de contact est invalide." };
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { success: false, message: "Adresse email invalide." };
        }

        const notificationData: ContactFormData = { name, email, subject, message };

        return {
            success: true,
            tableName: "Contact",
            row: {
                "Nom": name,
                "Email": email,
                "Objet": subject,
                "Message": message
            },
            notificationData
        };
    }

    const source = data as Partial<RecrutementFormData>;
    const firstname = safeString(source.firstname, { max: 80 });
    const lastname = safeString(source.lastname, { max: 80 });
    const promotionRaw = safeString(source.promotion, { max: 4 });
    const login = safeString(source.login, { max: 80 });
    const discordId = safeString(source.discordId, { max: 64 });
    const message = safeString(source.message, { max: 4000, optional: true }) ?? "";
    const interests = extractAllowedInterests(source.interests);

    if (!firstname || !lastname || !promotionRaw || !login || !discordId) {
        return { success: false, message: "Le formulaire de recrutement est invalide." };
    }

    if (!/^[a-z0-9-]+\.[a-z0-9-]+$/.test(login)) {
        return { success: false, message: "Le login Forge est invalide." };
    }

    const promotion = parsePromotion(promotionRaw);
    if (promotion === null) {
        return { success: false, message: "L'année de promotion est invalide." };
    }

    const notificationData: RecrutementFormData = {
        firstname,
        lastname,
        promotion: String(promotion),
        login,
        interests,
        message,
        discordId
    };

    return {
        success: true,
        tableName: "Inscriptions",
        row: {
            "Nom": lastname,
            "Prénom": firstname,
            "Année de promotion": promotion,
            "Login forge": login,
            "Centres d'intérets": interests,
            "Message de candidature": message,
            "Id discord": discordId,
            "Rôle": "Candidature déposée"
        },
        notificationData
    };
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...init,
            signal: controller.signal
        });
    } finally {
        clearTimeout(timeoutId);
    }
}

function checkRateLimit(rateKey: string): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
    const now = Date.now();
    const bucket = submissionBuckets.get(rateKey);

    if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
        submissionBuckets.set(rateKey, { windowStart: now, count: 1 });
        return { allowed: true };
    }

    if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
        const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - bucket.windowStart);
        return {
            allowed: false,
            retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000))
        };
    }

    bucket.count += 1;
    submissionBuckets.set(rateKey, bucket);
    return { allowed: true };
}

async function getClientIdentifier(): Promise<string> {
    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    const realIp = requestHeaders.get("x-real-ip");
    const userAgent = requestHeaders.get("user-agent");

    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim() || "unknown";
    }

    if (realIp?.trim()) {
        return realIp.trim();
    }

    return userAgent?.trim() || "unknown";
}

function truncateText(value: string, max: number): string {
    if (value.length <= max) {
        return value;
    }

    return `${value.slice(0, Math.max(0, max - 3))}...`;
}

function toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.name === "AbortError" ? "Timeout" : error.message;
    }

    return "Erreur inconnue";
}

interface AppAccessTokenResponse {
    app_name: string;
    access_token: string;
    dtable_uuid: string;
    workspace_id: number;
    dtable_name: string;
    use_api_gateway: boolean;
    dtable_server: string;
}

/**
 * Obtient un token d'accès pour l'application SeaTable.
 */
async function getAppAccessToken(): Promise<AppAccessTokenResult> {
    const apiToken = process.env.API_TOKEN?.trim();

    if (!apiToken) {
        console.error("[SERVER] API_TOKEN manquant dans les variables d'environnement");
        return { success: false, message: "Configuration serveur manquante (API_TOKEN)." };
    }

    try {
        const response = await fetchWithTimeout(`${SEATABLE_BASE_URL}/api/v2.1/dtable/app-access-token/`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'authorization': `Token ${apiToken}`
            },
            cache: 'no-store'
        }, AUTH_TIMEOUT_MS);

        if (!response.ok) {
            const details = await response.text();
            console.error(`[SERVER] Erreur lors de l'obtention de l'access token: ${response.status} ${truncateText(details, 500)}`);

            const isCloudflareChallenge = /just a moment|cf-chl|cloudflare/i.test(details);
            if (isCloudflareChallenge) {
                return {
                    success: false,
                    message: "SeaTable renvoie une page Cloudflare/anti-bot depuis Vercel. Il faut autoriser l'IP/Vercel côté SeaTable ou utiliser l'URL d'origine directe de SeaTable via SEATABLE_BASE_URL."
                };
            }

            return {
                success: false,
                message: `SeaTable a refusé l'authentification (${response.status}). ${details ? `Réponse: ${truncateText(details, 200)}` : ""}`.trim()
            };
        }

        return { success: true, data: await response.json() };
    } catch (error) {
        console.error("[SERVER] Erreur réseau lors de l'obtention de l'access token:", toErrorMessage(error));
        return { success: false, message: "Impossible de contacter SeaTable pour obtenir un token." };
    }
}

/**
 * Action serveur pour tester la connexion et récupérer les métadonnées de la base.
 */
export async function getMetadataAction() {
    const appAccess = await getAppAccessToken();

    if (!appAccess.success) {
        return { success: false, message: appAccess.message };
    }

    const { access_token, dtable_uuid } = appAccess.data;

    try {
        const response = await fetchWithTimeout(`${SEATABLE_BASE_URL}/api-gateway/api/v2/dtables/${dtable_uuid}/metadata/`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'authorization': `Token ${access_token}`
            },
            cache: 'no-store'
        }, AUTH_TIMEOUT_MS);

        if (!response.ok) {
            return { success: false, message: `Erreur API SeaTable: ${response.status}` };
        }

        const metadata = await response.json();
        return { success: true, metadata };
    } catch (error) {
        console.error("[SERVER] Erreur lors de la récupération des métadonnées:", toErrorMessage(error));
        return { success: false, message: "Erreur lors de la communication avec SeaTable." };
    }
}

/**
 * Envoie une notification Discord via Webhook.
 */
async function sendDiscordNotification(type: "contact" | "recrutement", data: ContactFormData | RecrutementFormData): Promise<boolean> {
     const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
     if (!webhookUrl) {
         console.warn("[SERVER] DISCORD_WEBHOOK_URL manquant, notification non envoyée");
         return false;
     }

     let title = "";
     let color = 0; // Décimal
     let fields: Array<{ name: string; value: string; inline?: boolean }> = [];

     if (type === "recrutement") {
         const payload = data as RecrutementFormData;
         title = "🚀 Nouvelle candidature déposée !";
         color = 16430602; // #fab60a en décimal
         fields = [
             { name: "Nom", value: truncateText(`${payload.firstname} ${payload.lastname}`, 1024), inline: true },
             { name: "Promotion", value: truncateText(`${payload.promotion}`, 1024), inline: true },
             { name: "Login Forge", value: truncateText(`${payload.login}`, 1024), inline: true },
             { name: "ID Discord", value: truncateText(`${payload.discordId}`, 1024), inline: true },
             { name: "Centres d'intérêts", value: truncateText(payload.interests.length > 0 ? payload.interests.join(", ") : "Aucun", 1024) },
             { name: "Message", value: truncateText(payload.message || "Aucun message", 1024) }
         ];
     } else {
         const payload = data as ContactFormData;
         title = "📩 Nouveau message de contact !";
         color = 3447003; // Bleu
         fields = [
             { name: "Nom", value: truncateText(payload.name, 1024), inline: true },
             { name: "Email", value: truncateText(payload.email, 1024), inline: true },
             { name: "Objet", value: truncateText(payload.subject, 1024) },
             { name: "Message", value: truncateText(payload.message, 1024) }
         ];
     }

     try {
         const unixTimestamp = Math.floor(Date.now() / 1000);
         const response = await fetchWithTimeout(webhookUrl, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 embeds: [{
                     title,
                     color,
                     description: `Reçu le : <t:${unixTimestamp}:f>`,
                     fields,
                     footer: { text: "L'atelier - Strasbourg" }
                 }]
             })
         }, DISCORD_TIMEOUT_MS);

         if (!response.ok) {
             const details = await response.text();
             console.error(`[SERVER] Échec webhook Discord (${response.status}): ${truncateText(details, 500)}`);
             return false;
         }

         console.log("[SERVER] Notification Discord envoyée avec succès");
         return true;
     } catch (error) {
         console.error("[SERVER] Erreur lors de l'envoi de la notification Discord:", toErrorMessage(error));
         return false;
     }
}

/**
 * Action serveur pour traiter l'envoi des formulaires de manière sécurisée.
 * Le token API reste sur le serveur.
 */
export async function submitFormAction(type: "contact" | "recrutement", data: FormDataTypes): Promise<ActionResult> {
    const requestId = crypto.randomUUID();
    const clientId = await getClientIdentifier();
    const rateKey = `${type}:${clientId}`;

    const rateLimitResult = checkRateLimit(rateKey);
    if (!rateLimitResult.allowed) {
        console.warn(`[SERVER] [${requestId}] Limite atteinte pour ${type} (${clientId})`);
        return {
            success: false,
            message: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
            requestId,
            retryAfterSeconds: rateLimitResult.retryAfterSeconds
        };
    }

    const validated = validateSubmission(type, data);
    if (!validated.success) {
        console.warn(`[SERVER] [${requestId}] Données invalides pour ${type}`);
        return { success: false, message: validated.message, requestId };
    }

    const appAccess = await getAppAccessToken();
    if (!appAccess.success) {
        console.error(`[SERVER] [${requestId}] ${appAccess.message}`);
        return { success: false, message: appAccess.message, requestId };
    }

    const { access_token, dtable_uuid } = appAccess.data;

    try {
        const response = await fetchWithTimeout(`${SEATABLE_BASE_URL}/api-gateway/api/v2/dtables/${dtable_uuid}/rows/`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'authorization': `Token ${access_token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                table_name: validated.tableName,
                rows: [validated.row]
            }),
            cache: 'no-store'
        }, API_TIMEOUT_MS);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[SERVER] [${requestId}] Erreur SeaTable (${response.status}): ${truncateText(errorText, 500)}`);
            return {
                success: false,
                message: `SeaTable a refusé l'enregistrement (${response.status}).`,
                requestId
            };
        }

         // Envoi synchrone de la notification Discord (on attend la réponse avant de retourner au client)
         // Cela garantit que Vercel n'interrompt pas la fonction avant le webhook Discord
         await sendDiscordNotification(type, validated.notificationData);

         return { success: true, message: "Données transmises avec succès à SeaTable.", requestId };
    } catch (error) {
        console.error(`[SERVER] [${requestId}] Erreur lors de l'envoi vers SeaTable: ${toErrorMessage(error)}`);
        return {
            success: false,
            requestId,
            message: error instanceof Error && error.name === "AbortError"
                ? "Le service met trop de temps à répondre. Veuillez réessayer."
                : "Erreur réseau lors de la communication avec SeaTable."
        };
    }
}
