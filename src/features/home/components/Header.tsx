import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import logo from '@/assets/logo.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-orange-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo et nom avec animation */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src={logo} 
              alt="Logo Ankòccitan" 
              className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" 
            />
            <span
              className={`text-2xl font-bold transition-all duration-300 group-hover:scale-105 ${
                isScrolled ? 'text-occitan-red' : 'text-white drop-shadow-lg'
              }`}
              style={{ fontFamily: 'Solway, Montserrat, Archer, Arial, sans-serif' }}
            >
              Ankòccitan
            </span>
          </Link>

          {/* Navigation avec micro-interactions */}
          <nav className="flex items-center space-x-4">
            <Link
              to="/auth"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                isScrolled 
                  ? 'text-gray-700 hover:text-occitan-red' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <span className="relative z-10">Connexion</span>
              <div className="absolute inset-0 bg-occitan-orange/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
            <Link
              to="/auth"
              className="bg-occitan-red text-white hover:bg-occitan-orange px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Créer un compte</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 