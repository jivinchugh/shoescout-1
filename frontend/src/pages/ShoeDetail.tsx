import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth0 } from "@auth0/auth0-react";
import { Heart, Loader2, ArrowLeft, Tag, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  const fetchShoeDetails = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shoes/${id}`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
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
      if (platformPrices && Array.isArray(platformPrices)) {
        const sizeData = platformPrices.find(p => p.size === size);
        if (sizeData && typeof sizeData.price === 'number' && sizeData.price > 0) {
          prices.push(sizeData.price);
        }
      }
    });
    
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const getPlatformPriceForSize = (size: string, platform: string): number | null => {
    if (!shoe?.size_specific_prices) return null;
    
    const platformPrices = shoe.size_specific_prices[platform as keyof typeof shoe.size_specific_prices];
    if (platformPrices && Array.isArray(platformPrices)) {
      const sizeData = platformPrices.find(p => p.size === size);
      if (sizeData && typeof sizeData.price === 'number' && sizeData.price > 0) {
        return sizeData.price;
      }
    }
    
    return null;
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
        await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${encodedTitle}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Add to favorites
        await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
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

            {/* Size Selection Section - Dropdown with Grid */}
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
                
                {/* Custom Dropdown with Grid */}
                <div className="space-y-4">
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full p-4 pr-10 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors duration-200 appearance-none cursor-pointer text-left"
                    >
                      {selectedSize ? `US ${selectedSize}${!selectedSize.includes('Y') && !selectedSize.includes('C') && !selectedSize.includes('W') && 'M'}` : 'Select a size to see specific prices'}
                    </button>
                    
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Dropdown Grid Content */}
                    {isDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="p-4">
                          {/* All Sizes Option */}
                          <button
                            onClick={() => {
                              setSelectedSize('');
                              setCurrentPrices({});
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full p-3 rounded text-left transition-colors mb-3 ${
                              selectedSize === '' 
                                ? 'bg-green-50 border-2 border-green-500' 
                                : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-gray-900 font-medium">All Sizes</div>
                            <div className="text-green-600 text-sm">
                              {(() => {
                                const allPrices = Object.values(shoe.lowest_resell_prices || {}).filter(p => p && p > 0);
                                return allPrices.length > 0 ? `$${Math.min(...allPrices).toFixed(0)}` : 'No data';
                              })()}
                            </div>
                          </button>
                          
                          {/* Size Grid */}
                          <div className="grid grid-cols-4 gap-2">
                            {shoe.available_sizes.map(size => {
                              const price = getPriceForSize(size);
                              const isSelected = selectedSize === size;
                              
                              return (
                                <button
                                  key={size}
                                  onClick={() => {
                                    handleSizeSelection(size);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`p-3 rounded-lg text-center transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-green-500 text-white border-2 border-green-600 shadow-md transform scale-105'
                                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="text-sm font-semibold mb-1">
                                    {size}
                                  </div>
                                  <div className={`text-xs font-medium ${
                                    isSelected ? 'text-green-100' : 'text-green-600'
                                  }`}>
                                    {price ? `$${price.toFixed(0)}` : 'N/A'}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Size selection info */}
                  {selectedSize && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Size {selectedSize} selected - Prices updated below
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Show message if no size data is available */}
            {(!shoe.available_sizes || shoe.available_sizes.length === 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ No size-specific pricing data available for this shoe. Only general pricing is shown below.
                </p>
              </div>
            )}

            {/* Resell Prices Section - Only show when size is selected */}
            {selectedSize && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  Resell Prices for Size {selectedSize}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Show platform-specific prices for selected size */}
                  {(() => {
                    const platforms = [
                      { key: 'stockX', name: 'StockX' },
                      { key: 'goat', name: 'GOAT' },
                      { key: 'flightClub', name: 'Flight Club' },
                      { key: 'stadiumGoods', name: 'Stadium Goods' }
                    ];
                    
                    return platforms.map(platform => {
                      const price = getPlatformPriceForSize(selectedSize, platform.key);
                      const hasData = price !== null;
                      
                      return (
                        <div key={platform.key} className={`p-3 rounded-lg border-2 ${
                          hasData 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-100'
                        }`}>
                          <p className="text-sm text-gray-500 mb-1">{platform.name}</p>
                          <p className={`text-xl font-bold ${
                            hasData ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {hasData ? formatPrice(price) : 'Not available for this size'}
                          </p>
                        </div>
                      );
                    });
                  })()}
                </div>
                
                {/* Show message if no prices are available for selected size */}
                {Object.keys(currentPrices).length === 0 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      ⚠️ No pricing data available for size {selectedSize}. 
                      Some platforms may not have this size in stock.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Initial Resell Prices Section - Show when no size is selected */}
            {!selectedSize && shoe.lowest_resell_prices && Object.values(shoe.lowest_resell_prices).some(price => price) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">Resell Prices</h2>
                <p className="text-sm text-gray-600 mb-4">Select a size above to see specific pricing</p>
                <div className="grid grid-cols-2 gap-4">
                  {shoe.lowest_resell_prices?.stockX && (
                    <div>
                      <p className="text-sm text-gray-500">StockX</p>
                      <p className="text-xl font-bold">{formatPrice(shoe.lowest_resell_prices.stockX)}</p>
                    </div>
                  )}
                  {shoe.lowest_resell_prices?.goat && (
                    <div>
                      <p className="text-sm text-gray-500">GOAT</p>
                      <p className="text-xl font-bold">{formatPrice(shoe.lowest_resell_prices.goat)}</p>
                    </div>
                  )}
                  {shoe.lowest_resell_prices?.flightClub && (
                    <div>
                      <p className="text-sm text-gray-500">Flight Club</p>
                      <p className="text-xl font-bold">{formatPrice(shoe.lowest_resell_prices.flightClub)}</p>
                    </div>
                  )}
                  {shoe.lowest_resell_prices?.stadiumGoods && (
                    <div>
                      <p className="text-sm text-gray-500">Stadium Goods</p>
                      <p className="text-xl font-bold">{formatPrice(shoe.lowest_resell_prices.stadiumGoods)}</p>
                    </div>
                  )}
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