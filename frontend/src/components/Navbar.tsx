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
import { Settings, LogOut, Ruler } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2); // Limit to 2 characters
};

export function Navbar() {
  // Add state for shoe size
  const [shoeSize, setShoeSize] = useState<string>("");
  const [isUpdatingSize, setIsUpdatingSize] = useState(false);
  const [showSizeDialog, setShowSizeDialog] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, getAccessTokenSilently, user, logout } = useAuth0();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { setResults, setIsLoading, setError } = useShoeResults();

  const isDashboard = location.pathname === "/dashboard";

  // Fetch the user's shoe size when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserShoeSize();
    }
  }, [isAuthenticated, user]);

  const fetchUserShoeSize = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:8080/api/shoe-size`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        if (userData.shoeSize) {
          setShoeSize(userData.shoeSize.toString());
        }
      }
    } catch (error) {
      console.error("Failed to fetch user shoe size:", error);
    }
  };

  const updateShoeSize = async () => {
    if (!shoeSize) return;
    
    setIsUpdatingSize(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:8080/api/shoe-size`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ shoeSize: parseFloat(shoeSize) }),
        }
      );

      if (response.ok) {
        // Close the dialog on success
        setShowSizeDialog(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to update shoe size:", errorData);
      }
    } catch (error) {
      console.error("Error updating shoe size:", error);
    } finally {
      setIsUpdatingSize(false);
    }
  };
  
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
        {/* Use position relative to allow absolute positioning of the search */}
        <div className="relative flex items-center justify-between h-14">
          {/* Logo on the left */}
          <div className="z-10">
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="relative flex items-center gap-2"
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
          </div>

          {/* Center search area - absolutely positioned */}
          {isAuthenticated && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 hidden md:block">
              <form onSubmit={handleSearch}>
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
            </div>
          )}

          {/* Navigation on the right */}
          <div className="z-10 flex items-center">
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
                        {/* Check if user and user.picture exist before trying to use them */}
                        <AvatarImage
                          src={user?.picture}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {/* Create initials from user name, or use default */}
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Shoe Size Dialog */}
                    <Dialog open={showSizeDialog} onOpenChange={setShowSizeDialog}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          className="cursor-default py-3" /* Changed from cursor-pointer to cursor-default */
                          onSelect={(e) => {
                            e.preventDefault(); // Prevent the dropdown from closing
                          }}
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <Ruler className="mr-2 h-4 w-4" />
                              <span>
                                Shoe Size: <span className="font-medium">{shoeSize || "Not set"}</span>
                              </span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs cursor-pointer hover:bg-primary/10 transition-colors" /* Added hover effect explicitly to button */
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSizeDialog(true);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-[425px] sm:w-full">
                        <DialogHeader>
                          <DialogTitle>Update Your Shoe Size</DialogTitle>
                          <DialogDescription>
                            Set your shoe size to get personalized recommendations.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                            <Label htmlFor="shoe-size" className="sm:text-right">
                              Shoe Size
                            </Label>
                            <Input
                              id="shoe-size"
                              type="text"
                              inputMode="decimal"
                              value={shoeSize}
                              onChange={(e) => setShoeSize(e.target.value)}
                              placeholder="e.g., 10, 10.5, EU 44"
                              className="col-span-1 sm:col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row">
                          <Button onClick={() => setShowSizeDialog(false)} variant="outline" className="w-full sm:w-auto">
                            Cancel
                          </Button>
                          <Button onClick={updateShoeSize} disabled={isUpdatingSize} className="w-full sm:w-auto">
                            {isUpdatingSize ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
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

            {/* Mobile menu toggle */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your code remains unchanged */}
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
