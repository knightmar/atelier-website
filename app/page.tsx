import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Slideshow from "@/components/Slideshow";

const labImages = [
  {
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80",
    alt: "Espace de travail de l'atelier"
  },
  {
    url: "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=1200&q=80",
    alt: "Établi avec outils électroniques"
  },
  {
    url: "https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?w=1200&q=80",
    alt: "Impression 3D en cours"
  }
];

const projects = [
  {
    title: "Imprimante 3D Recyclée",
    description: "Une imprimante 3D construite entièrement à partir de composants électroniques récupérés.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    tags: ["Hardware", "Écologie"]
  },
  {
    title: "Station Météo Connectée",
    description: "Système de surveillance environnementale temps réel avec transmission LoRa.",
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&q=80",
    tags: ["IoT", "Arduino"]
  },
  {
    title: "Borne d'Arcade Retro",
    description: "Une borne d'arcade faite main avec un Raspberry Pi et du bois de récupération.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    tags: ["Bois", "Retrogaming"]
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader 
        title={<>Bienvenue à <span className="text-makerlab">L'atelier</span></>}
        description="Le makerlab de Strasbourg. Un espace de création, d'innovation et de partage pour tous les passionnés de fabrication."
      />

      <section id="presentation" className="mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-4xl font-black uppercase italic">Le Lab</h2>
              <div className="h-1 flex-grow bg-makerlab"></div>
            </div>
            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Situé au cœur de Strasbourg, <span className="font-bold text-foreground">L'atelier</span> est un espace de fabrication numérique (Makerlab) ouvert à tous. Que vous soyez étudiant, professionnel ou simple curieux, nous mettons à votre disposition les outils et le savoir-faire pour transformer vos idées en réalité.
              </p>
              <p>
                Notre mission est de démocratiser l'accès aux technologies de fabrication moderne : impression 3D, découpe laser, électronique, et bien plus encore. Mais au-delà des machines, c'est avant tout une <span className="text-makerlab font-black italic uppercase">communauté passionnée</span> qui partage ses connaissances chaque jour.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="border-l-4 border-makerlab pl-4">
                  <span className="block text-2xl font-black italic">24/7</span>
                  <span className="text-sm uppercase font-bold text-gray-500">Accès membre</span>
                </div>
                <div className="border-l-4 border-makerlab pl-4">
                  <span className="block text-2xl font-black italic">+50</span>
                  <span className="text-sm uppercase font-bold text-gray-500">Makers actifs</span>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Slideshow images={labImages} />
          </div>
        </div>
      </section>

      <section id="projets">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black uppercase italic">Nos Projets</h2>
          <div className="h-1 flex-grow mx-6 bg-makerlab hidden sm:block"></div>
        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs font-bold bg-black text-makerlab rounded-md uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-black uppercase italic mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
