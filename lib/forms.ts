import { FormDataTypes } from "@/types/forms";
import { ActionResult, submitFormAction } from "@/app/actions/forms";

/**
 * Fonction pour envoyer les données du formulaire.
 * Utilise désormais une Server Action pour la sécurité.
 */
export async function sendData<T extends FormDataTypes>(type: "contact" | "recrutement", data: T): Promise<ActionResult> {
    try {
        return await submitFormAction(type, data);
    } catch (error) {
        console.error("Erreur lors de l'envoi des données:", error);
        return {
            success: false,
            message: "Erreur inattendue lors de l'envoi du formulaire.",
            requestId: "client-runtime"
        };
    }
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS simples côté client.
 */
export function escapeHTML(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
