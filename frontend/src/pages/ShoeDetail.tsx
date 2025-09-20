import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth0 } from "@auth0/auth0-react";
import { Heart, Loader2, ArrowLeft, Tag, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ShoeData {
  title: string;
  description: string;
  retail_price: string | number;
  image_url: string;
  user_size?: number;
  sku?: string;
  brand?: string;
  resell_links?: {
    stockX?: string;
    goat?: string;
    flightClub?: string;
    stadiumGoods?: string;
  };
  lowest_resell_prices?: {
    stockX?: number;
    goat?: number;
    flightClub?: number;
    stadiumGoods?: number;
  };
  size_specific_prices?: {
    stockX?: Array<{ size: string; price: number }>;
    goat?: Array<{ size: string; price: number }>;
    flightClub?: Array<{ size: string; price: number }>;
    stadiumGoods?: Array<{ size: string; price: number }>;
  };
  available_sizes?: string[];
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
  
  // Size selection state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [currentPrices, setCurrentPrices] = useState<{
    stockX?: number;
    goat?: number;
    flightClub?: number;
    stadiumGoods?: number;
  }>({});
  
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
  
  const fetchShoeDetails = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8080/shoes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch shoe details");

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setShoe(data[0]); // If it returns an array, use the first item
      } else {
        setShoe(data);
      }
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
  
  // Function to format description text by removing <br> tags
  const formatDescription = (description: string): string => {
    if (!description) return '';
    // Replace <br> tags with spaces
    return description.replace(/<br>/g, ' ').trim();
  };

  const formatPrice = (price: string | number | undefined): string => {
    if (!price || price === "N/A") return "N/A";
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
    return isNaN(numPrice) ? "N/A" : `$${numPrice.toFixed(2)}`;
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

  // Size selection helper functions
  const handleSizeSelection = (size: string) => {
    // If clicking the same size, deselect it
    if (selectedSize === size) {
      setSelectedSize('');
      setCurrentPrices({});
    } else {
      setSelectedSize(size);
      updatePricesForSize(size);
    }
  };

  const updatePricesForSize = (size: string) => {
    if (!shoe?.size_specific_prices) return;
    
    const newPrices: any = {};
    
    // Find price for selected size from each platform
    Object.keys(shoe.size_specific_prices).forEach(platform => {
      const platformPrices = shoe.size_specific_prices![platform as keyof typeof shoe.size_specific_prices];
      if (platformPrices) {
        const sizeData = platformPrices.find(p => p.size === size);
        if (sizeData) {
          newPrices[platform] = sizeData.price;
        }
      }
    });
    
    setCurrentPrices(newPrices);
  };

  const getPriceForSize = (size: string): number | null => {
    if (!shoe?.size_specific_prices) return null;
    
    // Return the lowest price for this size across all platforms
    const prices: number[] = [];
    Object.values(shoe.size_specific_prices).forEach(platformPrices => {
      if (platformPrices) {
        const sizeData = platformPrices.find(p => p.size === size);
        if (sizeData && sizeData.price) {
          prices.push(sizeData.price);
        }
      }
    });
    
    return prices.length > 0 ? Math.min(...prices) : null;
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
      <div className="bg-white min-h-screen">
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
                  onClick={handleFavoriteToggle}
                  disabled={favoriteActionLoading}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {favoriteActionLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Heart 
                      size={24} 
                      fill={isInFavorites() ? "red" : "none"} 
                      stroke = {isInFavorites() ? "red" : "gray"}
                      strokeWidth={2}
                    />
                  )}
                </motion.button>
              </div>
              
              <p className="flex items-center text-gray-600 mb-6">
                <Tag className="mr-2" size={16} /> {shoe.brand}
              </p>
              
              {shoe.sku && (
                <p className="text-sm text-gray-500 mb-2">SKU: {shoe.sku}</p>
              )}
              {shoe.description && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">Description</h2>
                  <p className="text-gray-700 text-sm">{formatDescription(shoe.description)}</p>
                </div>
              )}
              
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Retail Price</p>
                  <p className="text-xl font-bold">{formatPrice(shoe.retail_price)}</p>
                </div>
                {shoe.user_size && (
                  <div>
                    <p className="text-sm text-gray-500">Your Size</p>
                    <p className="text-xl font-bold">{shoe.user_size}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection Section - StockX Style */}
            {shoe.available_sizes && shoe.available_sizes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Size:</h2>
                  <p className="text-sm text-gray-600 mb-2">Size and Conversions</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                    <span><strong>Y:</strong> Youth</span>
                    <span><strong>C:</strong> Child</span>
                    <span><strong>W:</strong> Women's</span>
                    <span><strong>M:</strong> Men's</span>
                  </div>
                </div>
                
                {/* Size Dropdown - StockX Style */}
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setSelectedSize('');
                        setCurrentPrices({});
                      } else {
                        handleSizeSelection(value);
                      }
                    }}
                    className="w-full p-4 pr-10 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">Select a size to see specific prices</option>
                    {shoe.available_sizes.map(size => {
                      const price = getPriceForSize(size);
                      return (
                        <option key={size} value={size}>
                          US {size}{!size.includes('Y') && !size.includes('C') && !size.includes('W') && 'M'} 
                          {price ? ` - $${price.toFixed(0)}` : ''}
                        </option>
                      );
                    })}
                  </select>
                  
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Size selection info */}
                {selectedSize && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Size {selectedSize} selected - Prices updated below. Select "Select a size..." to deselect.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Resell Prices Section */}
            {shoe.lowest_resell_prices && Object.values(shoe.lowest_resell_prices).some(price => price) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  {selectedSize ? `Resell Prices for Size ${selectedSize}` : 'Resell Prices'}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Show selected size prices if available, otherwise show lowest prices */}
                  {(() => {
                    const pricesToShow = selectedSize && Object.keys(currentPrices).length > 0 
                      ? currentPrices 
                      : shoe.lowest_resell_prices;
                    
                    return (
                      <>
                        {pricesToShow?.stockX && (
                          <div>
                            <p className="text-sm text-gray-500">StockX</p>
                            <p className="text-xl font-bold">{formatPrice(pricesToShow.stockX)}</p>
                          </div>
                        )}
                        {pricesToShow?.goat && (
                          <div>
                            <p className="text-sm text-gray-500">GOAT</p>
                            <p className="text-xl font-bold">{formatPrice(pricesToShow.goat)}</p>
                          </div>
                        )}
                        {pricesToShow?.flightClub && (
                          <div>
                            <p className="text-sm text-gray-500">Flight Club</p>
                            <p className="text-xl font-bold">{formatPrice(pricesToShow.flightClub)}</p>
                          </div>
                        )}
                        {pricesToShow?.stadiumGoods && (
                          <div>
                            <p className="text-sm text-gray-500">Stadium Goods</p>
                            <p className="text-xl font-bold">{formatPrice(pricesToShow.stadiumGoods)}</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
              
            <div className="flex flex-col space-y-3">
              {shoe.resell_links?.stockX && (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={() => window.open(shoe.resell_links?.stockX, '_blank')}
                >
                  <ExternalLink size={16} />
                  View on StockX
                </Button>
              )}
              {shoe.resell_links?.goat && (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={() => window.open(shoe.resell_links?.goat, '_blank')}
                >
                  <ExternalLink size={16} />
                  View on GOAT
                </Button>
              )}
              {shoe.resell_links?.flightClub && (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={() => window.open(shoe.resell_links?.flightClub, '_blank')}
                >
                  <ExternalLink size={16} />
                  View on Flight Club
                </Button>
              )}
              {shoe.resell_links?.stadiumGoods && (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={() => window.open(shoe.resell_links?.stadiumGoods, '_blank')}
                >
                  <ExternalLink size={16} />
                  View on Stadium Goods
                </Button>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ShoeDetail;