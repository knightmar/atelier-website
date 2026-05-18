import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-makerlab text-black sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-black p-0.5 rounded-md transition-transform group-hover:scale-110 border border-white/5">
                <Image 
                  src="/logo_square.svg" 
                  alt="L'atelier Logo" 
                  width={40} 
                  height={40}
                  className="w-10 h-10 object-contain rounded-[4px]"
                />
              </div>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 font-bold">
            <Link href="/" className="hover:bg-black hover:text-makerlab px-3 py-2 rounded-md transition-all">Accueil</Link>
            <Link href="/membres" className="hover:bg-black hover:text-makerlab px-3 py-2 rounded-md transition-all">Membres</Link>
            <Link href="/recrutement" className="hover:bg-black hover:text-makerlab px-3 py-2 rounded-md transition-all">Recrutement</Link>
            <Link href="/contact" className="hover:bg-black hover:text-makerlab px-3 py-2 rounded-md transition-all">Contact</Link>
          </div>
          <div className="md:hidden flex items-center">
            {/* Mobile menu button would go here */}
            <button className="p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
