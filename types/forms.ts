export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface RecrutementFormData {
    firstname: string;
    lastname: string;
    promotion: string;
    login: string;
    interests: string[];
    message: string;
    discordId: string;
}

export type FormDataTypes = ContactFormData | RecrutementFormData;
