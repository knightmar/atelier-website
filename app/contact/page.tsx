"use client";

import PageHeader from "@/components/PageHeader";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("[DEBUG] Tentative d'envoi du formulaire de contact...");
    
    // Simulation d'envoi
    setTimeout(() => {
      console.log("[DEBUG] Message envoyé avec succès (simulation).");
      alert("Votre message a bien été envoyé ! (Mode debug : vérifiez la console)");
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader 
        title={<>Nous <span className="text-makerlab">Contacter</span></>}
        description="Une question ? Un projet en tête ? Ou simplement envie de passer nous voir ? Envoyez-nous un message&nbsp;!"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-black dark:border-gray-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-makerlab focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-makerlab focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-2">
                Objet <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="Sujet de votre message"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-makerlab focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={5}
                required
                placeholder="Dites-nous tout..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-makerlab focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-700 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 bg-black text-makerlab hover:bg-makerlab hover:text-black font-black uppercase italic text-xl rounded-xl transition-all shadow-lg border border-black active:translate-y-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-makerlab p-6 rounded-2xl border border-black shadow-lg">
            <h3 className="font-black uppercase italic mb-4 text-black">Où nous trouver ?</h3>
            <p className="text-black font-bold">
              L'atelier Strasbourg<br />
              5 Rue Gustave Adolphe Hirn<br />
              67000 Strasbourg, France
            </p>
          </div>

          <div className="bg-black text-white p-6 rounded-2xl border-b-4 border-makerlab shadow-lg">
            <h3 className="font-black uppercase italic mb-4 text-makerlab">Horaires</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((jour) => (
                <li key={jour} className="flex justify-between"><span>{jour}</span> <span className="font-bold">9h - 17h</span></li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-black uppercase italic mb-4">Réseaux</h3>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-makerlab hover:scale-110 transition-transform" 
                title="Instagram"
                onClick={(e) => { e.preventDefault(); console.log("[DEBUG] Clic sur Instagram"); }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-makerlab hover:scale-110 transition-transform" 
                title="Discord"
                onClick={(e) => { e.preventDefault(); console.log("[DEBUG] Clic sur Discord"); }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.579.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
