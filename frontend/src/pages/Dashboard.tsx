import { useState, useEffect } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Card } from "@/components/ui/card";
import { Search, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useShoeResults } from "@/context/ShoeResultsProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { results, isLoading, error } = useShoeResults();
  const [favorites, setFavorites] = useState([]);
  
  // Format price with dollar sign and commas
  const formatPrice = (price) => {
    if (price === "N/A") return "N/A";

    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
    if (isNaN(numPrice)) return "N/A";

    return `$${numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isInFavorites = (shoeTitle) => {
    return favorites.some(favorite => favorite.title === shoeTitle);
  };

  const handleViewClick = (shoe) => {
    const shoeId = shoe.id || encodeURIComponent(shoe.title.toLowerCase().replace(/\s+/g, '-'));
    navigate(`/shoe/${shoeId}`, { state: { shoe } });
  };

  const handleFavoriteClick = async (shoe) => {
    try {
      const token = await getAccessTokenSilently();
      
      if (isInFavorites(shoe.title)) {
        // Remove from favorites
        const encodedTitle = encodeURIComponent(shoe.title);
        await fetch(`http://localhost:8080/api/favorites/${encodedTitle}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Update favorites state
        setFavorites(favorites.filter(fav => fav.title !== shoe.title));
      } else {
        // Add to favorites
        await fetch("http://localhost:8080/api/favorites", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shoe),
        });
        
        // Update favorites state
        setFavorites([...favorites, shoe]);
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  // Fetch favorites when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("http://localhost:8080/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          {!results.length && !isLoading && !error && (
            <div className="text-center max-w-xl">
              <h1 className="text-3xl font-bold mb-4">Welcome to ShoeScout</h1>
              <p className="text-muted-foreground mb-8">
                Use the search bar at the top to find the best prices for your favorite shoes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/favorites')} variant="outline">
                  <Heart className="mr-2 h-4 w-4" />
                  View favorites
                </Button>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div id="search-results">
            {isLoading && (
              <div className="flex items-center justify-center mt-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Searching for shoes...</span>
              </div>
            )}

            {error && (
              <div className="mt-10 rounded-md bg-destructive/10 p-4 text-destructive">
                <h3 className="font-semibold">Error</h3>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && results.length > 0 && (
              <div className="mt-10 w-full">
                <h2 className="text-2xl font-semibold mb-6, py-10">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((shoe, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden bg-white hover:border-[#9b87f5]/70 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative">
                          {/* Image container */}
                          <div className="relative pb-[75%] bg-white">
                            <img
                              src={shoe.image_url}
                              alt={shoe.title}
                              className="absolute inset-0 w-full h-full object-contain p-2"
                            />
                            <button
                              className={`absolute top-2 right-2 rounded-full p-2 ${
                                isInFavorites(shoe.title) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFavoriteClick(shoe);
                              }}
                            >
                              <Heart fill={isInFavorites(shoe.title) ? "currentColor" : "none"} size={20} />
                            </button>
                          </div>
                          
                          {/* Content */}
                          <div className="p-3">
                            <h3 className="font-medium text-gray-800 mb-1">{shoe.title}</h3>
                            <div className="text-xs text-gray-600 mb-1">
                              Retail Price
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-gray-900">
                                {formatPrice(shoe.retail_price)}
                              </div>
                              <button 
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                                onClick={() => handleViewClick(shoe)}
                              >
                                View
                              </button>
                            </div>
                            <div className="text-xs flex items-center gap-1 mt-1.5 text-green-600">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 14L8.23309 16.4248C8.66178 16.7463 9.26772 16.6728 9.60705 16.2581L18 6" />
                              </svg>
                              Size {shoe.user_size} Available
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Dashboard;