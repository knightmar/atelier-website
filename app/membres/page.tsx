"use client";

import PageHeader from "@/components/PageHeader";
import Image from "next/image";
const members = [
  {
    name: "Arthur",
    role: "Expert Software",
    image: "/members/arthur.png",
    bio: "A coup de GDB il tabasse des bugs. Capable d'écrire du code dégeux a la vitesse de la lumière. #lovesRust"
  },
  {
    name: "Lentin",
    role: "Spécialiste Électronique",
    image: "/members/lentin.png",
    bio: "Le magicien des circuits. Si ça a besoin d'électricité, Lentin sait comment le faire fonctionner."
  },
  {
    name: "Louis",
    role: "Expert Système D",
    image: "/members/louis.png",
    bio: "On dit qu'il maitrise des langages anciens et cryptiques. Gcode et DST n'ont plus de secrets pour lui. Collectionne les hobbies couteux."
  },
  {
    name: "Thomas",
    role: "Guru Impression 3D",
    image: "/members/thomas.gif",
    bio: "Thomas ne voit pas de limites, seulement des couches de plastique prêtes à être fusionnées. Ya bien la place pour un LEGO géant, non ?"
  }
];

export default function MembresPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader 
        title={<>L&apos;Équipe <span className="text-makerlab">L&apos;atelier</span></>}
        description="Les visages derrière l'association à Strasbourg qui font vivre le lab au quotidien."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((member, index) => (
          <div 
            key={index} 
            className="text-center group"
          >
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-black group-hover:border-makerlab transition-all shadow-lg rotate-3 group-hover:rotate-0">
              <Image 
                src={member.image} 
                alt={member.name} 
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-black uppercase italic">{member.name}</h3>
            <p className="text-makerlab font-black uppercase text-sm mb-3 tracking-widest bg-black inline-block px-2 py-1 rounded">{member.role}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {member.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
