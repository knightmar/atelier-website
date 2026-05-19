"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 font-bold">
            <Link href="/" className="hover:bg-black hover:text-makerlab px-3 py-2 rounded-md transition-all">Accueil</Link>
            <Link href="/membres" className="hover:bg-black hover:text-makerlab px-3 py-2 rounded-md transition-all">Membres</Link>
            <Link href="/recrutement" className="hover:bg-black hover:text-makerlab px-3 py-2 rounded-md transition-all">Recrutement</Link>
            <Link href="/contact" className="hover:bg-black hover:text-makerlab px-3 py-2 rounded-md transition-all">Contact</Link>
            <Link href="/admin" className="hover:bg-black hover:text-white px-3 py-2 rounded-md transition-all border border-black/20 bg-black/5">Admin</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="p-2 hover:bg-black/10 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 border-t border-black/10' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-makerlab font-bold">
          <Link 
            href="/" 
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-makerlab transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link 
            href="/membres" 
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-makerlab transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Membres
          </Link>
          <Link 
            href="/recrutement" 
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-makerlab transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Recrutement
          </Link>
          <Link 
            href="/contact" 
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-makerlab transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link 
            href="/admin" 
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-white transition-all bg-black/5"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
