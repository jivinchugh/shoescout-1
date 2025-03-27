
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoginButton from './auth/LoginButton';
import LogoutButton from './auth/LogoutButton';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '@/components/brandLogos/_ACD37098-D53D-40DB-AEA0-52F68AB4128D_-removebg-preview.png';



export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth0();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled ? 'glass shadow-soft py-3' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href="/" className="relative z-10 flex items-center gap-2">
          <img src={logo} className="App-logo w-8 h-8 md:w-10 md:h-10" alt="logo" />
            <span className="font-display text-xl font-semibold text-gradient">
              ShoeScout
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Testimonials
            </a>
            <a
              href="#team"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Team
            </a>
            {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="ml-2 rounded-full p-2 text-foreground hover:bg-secondary"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-50 bg-background animate-fade-in md:hidden">
          <nav className="container mx-auto flex h-full flex-col items-center justify-center space-y-8 p-4">
            <a
              href="#features"
              className="text-xl font-medium text-foreground transition-colors hover:text-primary"
              onClick={toggleMobileMenu}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-xl font-medium text-foreground transition-colors hover:text-primary"
              onClick={toggleMobileMenu}
            >
              Testimonials
            </a>
            <a
              href="#team"
              className="text-xl font-medium text-foreground transition-colors hover:text-primary"
              onClick={toggleMobileMenu}
            >
              Team
            </a>
            {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
            
          </nav>
        </div>
      )}
    </header>
  );
}
