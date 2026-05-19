"use server";

import { FormDataTypes } from "@/types/forms";

const SEATABLE_BASE_URL = "https://atelier.benetnath.fr";

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
async function getAppAccessToken(): Promise<AppAccessTokenResponse | null> {
    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
        console.error("[SERVER] API_TOKEN manquant dans les variables d'environnement");
        return null;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 secondes

        const response = await fetch(`${SEATABLE_BASE_URL}/api/v2.1/dtable/app-access-token/`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'authorization': `Token ${apiToken}`
            },
            cache: 'no-store',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`[SERVER] Erreur lors de l'obtention de l'access token: ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("[SERVER] Erreur réseau lors de l'obtention de l'access token:", error);
        return null;
    }
}

/**
 * Action serveur pour tester la connexion et récupérer les métadonnées de la base.
 */
export async function getMetadataAction() {
    const appAccess = await getAppAccessToken();
    
    if (!appAccess) {
        return { success: false, message: "Impossible d'obtenir le token d'accès." };
    }

    const { access_token, dtable_uuid } = appAccess;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 secondes

        // Selon l'issue, l'URL fonctionnelle est en v2
        const response = await fetch(`${SEATABLE_BASE_URL}/api-gateway/api/v2/dtables/${dtable_uuid}/metadata/`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'authorization': `Token ${access_token}`
            },
            cache: 'no-store',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return { success: false, message: `Erreur API SeaTable: ${response.status}` };
        }

        const metadata = await response.json();
        return { success: true, metadata };
    } catch (error) {
        console.error("[SERVER] Erreur lors de la récupération des métadonnées:", error);
        return { success: false, message: "Erreur lors de la communication avec SeaTable." };
    }
}

/**
 * Envoie une notification Discord via Webhook.
 */
async function sendDiscordNotification(type: "contact" | "recrutement", data: any) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn("[SERVER] DISCORD_WEBHOOK_URL manquant, notification non envoyée");
        return;
    }

    let title = "";
    let color = 0; // Décimal
    let fields = [];

    if (type === "recrutement") {
        title = "🚀 Nouvelle candidature déposée !";
        color = 16430602; // #fab60a en décimal
        fields = [
            { name: "Nom", value: `${data.firstname} ${data.lastname}`, inline: true },
            { name: "Promotion", value: `${data.promotion}`, inline: true },
            { name: "Login Forge", value: `${data.login}`, inline: true },
            { name: "ID Discord", value: `${data.discordId}`, inline: true },
            { name: "Centres d'intérêts", value: (data.interests && data.interests.length > 0) ? data.interests.join(", ") : "Aucun" },
            { name: "Message", value: data.message || "Aucun message" }
        ];
    } else {
        title = "📩 Nouveau message de contact !";
        color = 3447003; // Bleu
        fields = [
            { name: "Nom", value: data.name, inline: true },
            { name: "Email", value: data.email, inline: true },
            { name: "Objet", value: data.subject },
            { name: "Message", value: data.message }
        ];
    }

    try {
        const unixTimestamp = Math.floor(Date.now() / 1000);
        await fetch(webhookUrl, {
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
        });
        console.log(`[SERVER] Notification Discord envoyée pour ${type}`);
    } catch (error) {
        console.error("[SERVER] Erreur lors de l'envoi de la notification Discord:", error);
    }
}

/**
 * Action serveur pour traiter l'envoi des formulaires de manière sécurisée.
 * Le token API reste sur le serveur.
 */
export async function submitFormAction(type: "contact" | "recrutement", data: FormDataTypes) {
    console.log(`[SERVER] [ACTION] Traitement du formulaire ${type} sur le serveur`);
    
    const appAccess = await getAppAccessToken();
    if (!appAccess) {
        return { success: false, message: "Erreur d'authentification avec SeaTable." };
    }

    const { access_token, dtable_uuid } = appAccess;
    const tableName = type === "recrutement" ? "Inscriptions" : "Contact";

    // Préparation de la ligne à insérer
    let row: Record<string, any> = {};

    if (type === "recrutement") {
        const d = data as any;
        
        console.log(`[DEBUG] Envoi des centres d'intérêts:`, d.interests);
        row = {
            "Nom": d.lastname,
            "Prénom": d.firstname,
            "Année de promotion": parseInt(d.promotion),
            "Login forge": d.login,
            "Centres d'intérets": d.interests || [],
            "Message de candidature": d.message,
            "Id discord": d.discordId,
            "Rôle": "Candidature déposée"
        };
    } else {
        const d = data as any;
        row = {
            "Nom": d.name,
            "Email": d.email,
            "Objet": d.subject,
            "Message": d.message
        };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 secondes pour l'envoi

        const response = await fetch(`${SEATABLE_BASE_URL}/api-gateway/api/v2/dtables/${dtable_uuid}/rows/`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'authorization': `Token ${access_token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                table_name: tableName,
                rows: [row]
            }),
            cache: 'no-store',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[SERVER] Erreur SeaTable (${response.status}):`, errorText);
            return { success: false, message: `Erreur lors de l'enregistrement dans SeaTable.` };
        }

        // Notification Discord asynchrone (on n'attend pas la réponse pour retourner le succès au client)
        sendDiscordNotification(type, data).catch(err => 
            console.error("[SERVER] Erreur asynchrone notification Discord:", err)
        );

        return { success: true, message: "Données transmises avec succès à SeaTable." };
    } catch (error) {
        console.error("[SERVER] Erreur lors de l'envoi vers SeaTable:", error);
        return { success: false, message: "Erreur réseau lors de la communication avec SeaTable." };
    }
}
