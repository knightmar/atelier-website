"use client";

import {useState} from "react";
import PageHeader from "@/components/PageHeader";
import { RecrutementFormData } from "@/types/forms";
import { sendData, escapeHTML } from "@/lib/forms";

export default function RecrutementPage() {
    const [formData, setFormData] = useState<RecrutementFormData>({
        firstname: "",
        lastname: "",
        promotion: "",
        login: "",
        interests: [],
        message: "",
        discordId: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Validation Prénom
        if (!formData.firstname.trim()) {
            newErrors.firstname = "Le prénom est requis";
        }

        // Validation Nom
        if (!formData.lastname.trim()) {
            newErrors.lastname = "Le nom est requis";
        }

        // Validation Année de promotion (2000-2031)
        const promoYear = parseInt(formData.promotion);
        if (isNaN(promoYear) || promoYear < 2000 || promoYear > 2031) {
            newErrors.promotion = "L'année doit être entre 2000 et 2031";
        }

        // Validation Login Forge (aaaaaaa.bbbbbbbb)
        // minuscules, sans accents, peut contenir "-"
        const loginRegex = /^[a-z0-9-]+\.[a-z0-9-]+$/;
        if (!loginRegex.test(formData.login)) {
            newErrors.login = "Format attendu : prenom.nom (minuscules, chiffres, tirets)";
        }

        // Validation Id Discord
        if (!formData.discordId.trim()) {
            newErrors.discordId = "L'Id Discord est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus(null);

        if (validate()) {
            setIsSubmitting(true);
            // Échappement des données
            const sanitizedData: RecrutementFormData = {
                firstname: escapeHTML(formData.firstname),
                lastname: escapeHTML(formData.lastname),
                login: escapeHTML(formData.login),
                promotion: escapeHTML(formData.promotion),
                message: escapeHTML(formData.message),
                discordId: escapeHTML(formData.discordId),
                interests: formData.interests // Pas d'échappement pour les options prédéfinies SeaTable
            };

            const success = await sendData("recrutement", sanitizedData);

            // Remonter en haut de page pour voir le message
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (success) {
                setSubmitStatus({
                    type: 'success',
                    message: "Candidature envoyée avec succès ! Nous étudierons ton profil très bientôt."
                });
                // Reset form
                    setFormData({
                        firstname: "",
                        lastname: "",
                        promotion: "",
                        login: "",
                        interests: [],
                        message: "",
                        discordId: ""
                    });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: "Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard."
                });
            }
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        setFormData(prev => ({...prev, [id]: value}));
        // Clear error when user types
        if (errors[id]) {
            setErrors(prev => {
                const next = {...prev};
                delete next[id];
                return next;
            });
        }
    };

    const handleCheckboxChange = (interest: string) => {
        setFormData(prev => {
            const interests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return {...prev, interests};
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <PageHeader
                title={<>Rejoindre <span className="text-makerlab">L&apos;atelier</span></>}
                description="Tu as des projets plein la tête ? Tu veux apprendre ou partager tes compétences à Strasbourg ? Remplis ce formulaire pour nous rejoindre&nbsp;!"
            />

            <div className="max-w-3xl mx-auto">
                {submitStatus && (
                    <div className={`mb-6 p-4 rounded-xl border font-black uppercase italic text-center ${
                        submitStatus.type === 'success' 
                            ? 'bg-makerlab/10 border-makerlab text-black dark:text-makerlab' 
                            : 'bg-red-500/10 border-red-500 text-red-500'
                    }`}>
                        {submitStatus.message}
                    </div>
                )}
                <form onSubmit={handleSubmit}
                      className="bg-white dark:bg-black shadow-2xl rounded-2xl p-8 border border-black space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="firstname" className="block text-sm font-black uppercase italic">
                                Prénom <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                required
                                value={formData.firstname}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-4 focus:ring-makerlab focus:border-black outline-none transition-all ${errors.firstname ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                                placeholder="Jean"
                            />
                            {errors.firstname &&
                                <p className="text-red-500 text-xs font-bold uppercase">{errors.firstname}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastname" className="block text-sm font-black uppercase italic">
                                Nom <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                required
                                value={formData.lastname}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-4 focus:ring-makerlab focus:border-black outline-none transition-all ${errors.lastname ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                                placeholder="Dupont"
                            />
                            {errors.lastname &&
                                <p className="text-red-500 text-xs font-bold uppercase">{errors.lastname}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="promotion" className="block text-sm font-black uppercase italic">
                                Année de promotion <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="promotion"
                                required
                                min="2000"
                                max="2031"
                                value={formData.promotion}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-4 focus:ring-makerlab focus:border-black outline-none transition-all ${errors.promotion ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                                placeholder="2025"
                            />
                            {errors.promotion &&
                                <p className="text-red-500 text-xs font-bold uppercase">{errors.promotion}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="login" className="block text-sm font-black uppercase italic">
                                Login Forge <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="login"
                                required
                                value={formData.login}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-4 focus:ring-makerlab focus:border-black outline-none transition-all ${errors.login ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                                placeholder="jean.dupont"
                            />
                            {errors.login && <p className="text-red-500 text-xs font-bold uppercase">{errors.login}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="discordId" className="block text-sm font-black uppercase italic">
                            Id Discord <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="discordId"
                            required
                            value={formData.discordId}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border bg-transparent focus:ring-4 focus:ring-makerlab focus:border-black outline-none transition-all ${errors.discordId ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                            placeholder="username#0000 ou username"
                        />
                        {errors.discordId && <p className="text-red-500 text-xs font-bold uppercase">{errors.discordId}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-black uppercase italic">Centres d&apos;intérêts</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                            {['Impression 3D', 'Éléctronique', 'Software', 'Textile', 'Bois'].map(interest => (
                                <label key={interest}
                                       className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border border-transparent hover:border-makerlab hover:bg-makerlab/5 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={formData.interests.includes(interest)}
                                        onChange={() => handleCheckboxChange(interest)}
                                        className="w-5 h-5 text-black rounded border border-black focus:ring-makerlab accent-makerlab"
                                    />
                                    <span className="text-sm font-bold">{interest}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-black uppercase italic">Message de candidature</label>
                        <textarea
                            id="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-4 focus:ring-makerlab focus:border-black outline-none transition-all resize-none"
                            placeholder="Parle-nous de tes motivations / projets en cours (ex: J'aimerais fabriquer mon propre clavier mécanique...)"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 bg-black text-makerlab hover:bg-makerlab hover:text-black font-black uppercase italic text-xl rounded-xl transition-all shadow-lg border border-black active:translate-y-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                    </button>

                    <p className="text-xs text-center text-gray-500 font-medium">
                        En envoyant ce formulaire, tu acceptes que tes données soient traitées par l&apos;association
                        L&apos;atelier pour traiter ta demande de recrutement.
                    </p>
                </form>
            </div>
        </div>
    );
}
