import { useState, useEffect, JSX } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Heart, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "@/components/brandLogos/_ACD37098-D53D-40DB-AEA0-52F68AB4128D_-removebg-preview.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useShoeResults } from "@/context/ShoeResultsProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { setResults, setIsLoading, setError } = useShoeResults();

  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const token = await getAccessTokenSilently();
      const formattedQuery = searchQuery.trim().replace(/\s+/g, "-");

      const response = await fetch(
        `http://localhost:8080/shoes/${formattedQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch shoes");
      }

      const data = await response.json();
      setResults(data);

      if (!isDashboard) {
        navigate("/dashboard");
      }

      setTimeout(() => {
        document
          .getElementById("search-results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        isScrolled ? "glass shadow-soft py-3" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="relative z-10 flex items-center gap-2"
          >
            <img
              src={logo}
              className="App-logo w-8 h-8 md:w-10 md:h-10"
              alt="logo"
            />
            <span className="font-display text-xl font-semibold text-gradient">
              ShoeScout
            </span>
          </Link>

          {/* Search Bar - Only visible when authenticated */}
          {isAuthenticated && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for shoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background"
                />
              </div>
            </form>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {/* Only show these links when not authenticated */}
            {!isAuthenticated && (
              <>
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
              </>
            )}

            {/* Dashboard link - only visible when authenticated */}
            {/* {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
            )} */}

            {/* Favorites link - only visible when authenticated */}
            {isAuthenticated && (
              <Link
                to="/favorites"
                className="favorites-button text-sm font-medium text-foreground/80 transition-colors hover:text-primary flex items-center gap-1"
              >
                <Heart className="h-4 w-4" /> Favorites
              </Link>
            )}

            {!isAuthenticated && <LoginButton />}
            <ThemeToggle />
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.picture} alt="User" />
                      <AvatarFallback className="bg-shoescout-purple text-white">
                        US
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account preferences</span>
                  </DropdownMenuItem>
                  
                    
                    <DropdownMenuItem 
                      className="text-red-500 cursor-pointer"
                      onClick={() =>
                        logout({
                          logoutParams: { returnTo: window.location.origin },
                        })
                      }
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
           
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            {/* Mobile search button - only visible when authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-2 p-2 text-foreground/80 hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* Favorites button for mobile - only visible when authenticated */}
            {isAuthenticated && (
              <Link
                to="/favorites"
                className="favorites-button mr-2 p-2 text-foreground/80 hover:text-primary"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="ml-2 rounded-full p-2 text-foreground hover:bg-secondary"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-20">
          <div className="container mx-auto px-4">
            {/* Mobile Search - Only visible when authenticated */}
            {isAuthenticated && (
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for shoes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </form>
            )}

            <nav className="flex flex-col space-y-6 pb-6">
              {/* Only show these links when not authenticated */}
              {!isAuthenticated && (
                <>
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
                </>
              )}

              {/* Dashboard link to mobile menu */}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="text-xl font-medium text-foreground transition-colors hover:text-primary flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>
              )}

              {/* Add Favorites link to mobile menu */}
              {isAuthenticated && (
                <Link
                  to="/favorites"
                  className="text-xl font-medium text-foreground transition-colors hover:text-primary flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <Heart className="h-5 w-5" /> Favorites
                </Link>
              )}

              {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
