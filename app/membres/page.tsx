"use client";

import PageHeader from "@/components/PageHeader";

const members = [
  {
    name: "Arthur",
    role: "Expert Fabrication",
    image: "/members/arthur.png",
    bio: "Arthur maîtrise l'art de transformer le métal et le bois avec une précision chirurgicale."
  },
  {
    name: "Lentin",
    role: "Spécialiste Électronique",
    image: "/members/lentin.png",
    bio: "Le magicien des circuits. Si ça a besoin d'électricité, Lentin sait comment le faire fonctionner."
  },
  {
    name: "Louis",
    role: "Designer Industriel",
    image: "/members/louis.png",
    bio: "Louis apporte une touche esthétique et fonctionnelle à tous nos projets les plus fous."
  },
  {
    name: "Thomas",
    role: "Guru Impression 3D",
    image: "/members/thomas.png",
    bio: "Thomas ne voit pas de limites, seulement des couches de plastique prêtes à être fusionnées."
  }
];

export default function MembresPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader 
        title={<>L'Équipe <span className="text-makerlab">L'atelier</span></>}
        description="Les visages derrière l'association à Strasbourg qui font vivre le lab au quotidien."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((member, index) => (
          <div 
            key={index} 
            className="text-center group cursor-pointer"
            onClick={() => console.log(`[DEBUG] Clic sur le membre : ${member.name}`)}
          >
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-black group-hover:border-makerlab transition-all shadow-lg rotate-3 group-hover:rotate-0">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover"
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
