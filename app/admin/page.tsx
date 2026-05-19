"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getMetadataAction } from "@/app/actions/forms";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleTestMetadata = async () => {
        setIsLoading(true);
        setResult(null);
        
        try {
            const data = await getMetadataAction();
            setResult(data);
        } catch (error) {
            setResult({ success: false, message: "Erreur lors de l'appel à l'action." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <PageHeader 
                title={<>Espace <span className="text-makerlab">Admin</span></>}
                description="Outils de maintenance et de test pour l'intégration SeaTable."
            />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-black rounded-2xl border border-black p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <h2 className="text-2xl font-black uppercase italic">Tests API SeaTable</h2>
                        <button
                            onClick={handleTestMetadata}
                            disabled={isLoading}
                            className={`px-6 py-3 bg-makerlab text-black font-black uppercase italic rounded-xl border border-black hover:bg-black hover:text-makerlab transition-all shadow-md active:translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? "Chargement..." : "Récupérer Métadonnées"}
                        </button>
                    </div>

                    {result && (
                        <div className={`mt-6 rounded-xl border p-6 overflow-hidden ${result.success ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="font-black uppercase italic text-sm">
                                    Statut: {result.success ? 'Succès' : 'Échec'}
                                </span>
                            </div>
                            
                            {result.message && (
                                <p className="text-sm mb-4 font-bold">{result.message}</p>
                            )}

                            {result.metadata && (
                                <div className="relative">
                                    <div className="absolute top-0 right-0 text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                        JSON Response
                                    </div>
                                    <pre className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-800 max-h-[400px]">
                                        {JSON.stringify(result.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    {!result && !isLoading && (
                        <div className="text-center py-12 text-gray-500 italic">
                            Cliquez sur le bouton pour tester la connexion avec l'API SeaTable et afficher les métadonnées de la base.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
