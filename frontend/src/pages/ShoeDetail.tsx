import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth0 } from "@auth0/auth0-react";
import { Heart, Loader2, ArrowLeft, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ShoeData {
  title: string;
  description: string;
  retail_price: string | number;
  market_price: string | number;
  buy_now_price: string | number;
  user_size: number;
  brand: string;
  image_url: string;
  id?: string;
}

const ShoeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  // Use state from navigation or fetch data if needed
  const [shoe, setShoe] = useState<ShoeData | null>(location.state?.shoe || null);
  const [isLoading, setIsLoading] = useState(!location.state?.shoe);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<ShoeData[]>([]);
  const [favoriteActionLoading, setFavoriteActionLoading] = useState(false);
  
  useEffect(() => {
    // If shoe data wasn't passed in navigation state, fetch it
    if (!shoe && isAuthenticated) {
      fetchShoeDetails();
    }
    
    // Fetch favorites to check if this shoe is favorited
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [id, isAuthenticated]);
  
  // Fetch shoe details from API if not provided via navigation
  const fetchShoeDetails = async () => {
    setIsLoading(true);
    try {
      // You'll need to implement this API endpoint
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8080/api/shoes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch shoe details");
      }
      
      const data = await response.json();
      setShoe(data);
    } catch (err) {
      console.error("Error fetching shoe details:", err);
      setError("Failed to load shoe details");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch favorites method
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
  
  // Check if shoe is in favorites
  const isInFavorites = (): boolean => {
    if (!shoe) return false;
    return favorites.some(fav => fav.title === shoe.title);
  };
  
  // Format price with dollar sign and commas
  const formatPrice = (price: string | number | undefined): string => {
    if (!price || price === "N/A") return "N/A";

    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;

    if (isNaN(numPrice)) return "N/A";

    return `$${numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  
  // Calculate savings percentage
  const calculateSavings = (retail: string | number = 0, market: string | number = 0): string => {
    if (retail === "N/A" || market === "N/A") return "N/A";

    const retailPrice = typeof retail === "string" ? Number.parseFloat(retail) : retail;
    const marketPrice = typeof market === "string" ? Number.parseFloat(market) : market;

    if (isNaN(retailPrice) || isNaN(marketPrice) || retailPrice <= 0) return "N/A";

    const savings = ((retailPrice - marketPrice) / retailPrice) * 100;
    return savings <= 0 ? "0%" : `${Math.round(savings)}%`;
  };
  
  // Toggle favorite status
  const handleFavoriteToggle = async () => {
    if (!shoe) return;
    
    setFavoriteActionLoading(true);
    
    try {
      const token = await getAccessTokenSilently();
      
      if (isInFavorites()) {
        // Remove from favorites
        const encodedTitle = encodeURIComponent(shoe.title);
        await fetch(`http://localhost:8080/api/favorites/${encodedTitle}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      }
      
      // Refresh favorites
      fetchFavorites();
    } catch (err) {
      console.error("Error updating favorites:", err);
    } finally {
      setFavoriteActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
          <div className="loading-state">
            <Loader2 className="spinner" />
            <span>Loading shoe details...</span>
          </div>
        </div>
      </AuthLayout>
    );
  }
  
  if (error || !shoe) {
    return (
      <AuthLayout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="error-alert">
            <h3>Error</h3>
            <p>{error || "Shoe not found"}</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-40">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-lg p-8 flex items-center justify-center">
            {shoe.image_url ? (
              <img 
                src={shoe.image_url} 
                alt={shoe.title} 
                className="max-h-[500px] object-contain"
              />
            ) : (
              <div className="h-[400px] w-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
          
          {/* Details Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{shoe.title}</h1>
              <motion.button
                className={`favorite-button-round ${isInFavorites() ? 'favorited' : ''}`}
                onClick={handleFavoriteToggle}
                disabled={favoriteActionLoading}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                {favoriteActionLoading ? (
                  <Loader2 className="spinner" />
                ) : (
                  <Heart className={isInFavorites() ? "filled-heart" : ""} size={24} />
                )}
              </motion.button>
            </div>
            
            <p className="flex items-center text-gray-600 mb-6">
              <Tag className="mr-2" size={16} /> {shoe.brand}
            </p>
            
            {shoe.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <div 
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: shoe.description }}
                />
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Retail Price</p>
                  <p className="text-xl font-bold">{formatPrice(shoe.retail_price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Market Price</p>
                  <p className="text-xl font-bold">{formatPrice(shoe.market_price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Your Size</p>
                  <p className="text-xl font-bold">{shoe.user_size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Buy Now Price</p>
                  <p className="text-xl font-bold">{formatPrice(shoe.buy_now_price)}</p>
                </div>
              </div>
            </div>
            
            {calculateSavings(shoe.retail_price, shoe.market_price) !== "0%" &&
              calculateSavings(shoe.retail_price, shoe.market_price) !== "N/A" && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-6">
                  You save {calculateSavings(shoe.retail_price, shoe.market_price)} off retail price!
                </div>
              )}
            
            <div className="flex flex-col space-y-3">
              <Button variant="outline" className="w-full">View Price on StockX</Button>
              <Button variant="outline" className="w-full">View Price on GOAT</Button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ShoeDetail;