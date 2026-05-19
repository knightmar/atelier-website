"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";

export default function RecrutementPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    promotion: "",
    login: "",
    skills: [] as string[],
    message: ""
  });

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const escapeHTML = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[DEBUG] Tentative de soumission du formulaire de recrutement...");
    
    if (validate()) {
      // Échappement des données (simulation d'envoi)
      const sanitizedData = {
        ...formData,
        firstname: escapeHTML(formData.firstname),
        lastname: escapeHTML(formData.lastname),
        login: escapeHTML(formData.login),
        message: escapeHTML(formData.message),
      };
      
      console.log("[DEBUG] Formulaire valide. Données prêtes pour l'API :", sanitizedData);
      console.log("[DEBUG] Simulation d'appel API en cours...");
      
      alert("Candidature envoyée avec succès ! (Mode simulation activé - vérifiez la console)");
      
      // Reset form placeholder
      setFormData({
        firstname: "",
        lastname: "",
        promotion: "",
        login: "",
        skills: [],
        message: ""
      });
    } else {
      console.warn("[DEBUG] Soumission bloquée : erreurs de validation détectées.", errors);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleCheckboxChange = (skill: string) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader 
        title={<>Rejoindre <span className="text-makerlab">L'atelier</span></>}
        description="Tu as des projets plein la tête ? Tu veux apprendre ou partager tes compétences à Strasbourg ? Remplis ce formulaire pour nous rejoindre&nbsp;!"
      />
      
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-black shadow-2xl rounded-2xl p-8 border border-black space-y-6">
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
              {errors.firstname && <p className="text-red-500 text-xs font-bold uppercase">{errors.firstname}</p>}
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
              {errors.lastname && <p className="text-red-500 text-xs font-bold uppercase">{errors.lastname}</p>}
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
              {errors.promotion && <p className="text-red-500 text-xs font-bold uppercase">{errors.promotion}</p>}
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
            <label className="block text-sm font-black uppercase italic">Tes domaines de prédilection</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Impression 3D', 'Électronique', 'Menuiserie', 'Robotique', 'Couture', 'Développement'].map(skill => (
                <label key={skill} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border border-transparent hover:border-makerlab hover:bg-makerlab/5 transition-all">
                  <input 
                    type="checkbox" 
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleCheckboxChange(skill)}
                    className="w-5 h-5 text-black rounded border border-black focus:ring-makerlab accent-makerlab" 
                  />
                  <span className="text-sm font-bold">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-black uppercase italic">Parle-nous de tes motivations / projets en cours</label>
            <textarea 
              id="message" 
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-4 focus:ring-makerlab focus:border-black outline-none transition-all resize-none"
              placeholder="J'aimerais fabriquer mon propre clavier mécanique..."
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-black text-makerlab hover:bg-makerlab hover:text-black font-black uppercase italic text-xl rounded-xl transition-all shadow-lg border border-black active:translate-y-1"
          >
            Envoyer ma candidature
          </button>
          
          <p className="text-xs text-center text-gray-500 font-medium">
            En envoyant ce formulaire, tu acceptes que tes données soient traitées par l'association L'atelier pour traiter ta demande de recrutement.
          </p>
        </form>
      </div>
    </div>
  );
}
