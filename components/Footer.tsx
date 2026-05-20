import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-auto border-t-4 border-makerlab">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-[#f7ae0c] p-2 rounded-lg rotate-3 border border-black/10">
              <Image 
                src="/logo_square.svg" 
                alt="L&apos;atelier Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase text-makerlab">L&apos;atelier</h3>
              <p className="text-gray-400 text-sm">Makerlab associatif à Strasbourg</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              © {new Date().getFullYear()} L&apos;atelier. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
