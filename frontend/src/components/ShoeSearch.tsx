"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Search, Loader2, Heart, Tag, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import "./Searchstyles.css";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Update your ShoeData interface in ShoeSearch.tsx to include all necessary fields:
interface ShoeData {
  title: string;
  description: string;
  retail_price: string | number;
  market_price?: string | number;
  buy_now_price?: string | number;
  user_size?: number;
  brand?: string;
  image_url: string;
  sku?: string;
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
  id?: string;
}

export default function ShoeSearch() {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShoeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShoe, setSelectedShoe] = useState<ShoeData | null>(null);
  const [favorites, setFavorites] = useState<ShoeData[]>([]);
  const [favoriteActionLoading, setFavoriteActionLoading] = useState(false);
  const [favoriteActionError, setFavoriteActionError] = useState<string | null>(null);

  // Format price with dollar sign and commas
  const formatPrice = (price: string | number): string => {
    if (price === "N/A") return "N/A";

    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;

    if (isNaN(numPrice)) return "N/A";

    return `$${numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate savings percentage
  const calculateSavings = (retail: string | number, market: string | number): string => {
    if (retail === "N/A" || market === "N/A") return "N/A";

    const retailPrice = typeof retail === "string" ? Number.parseFloat(retail) : retail;
    const marketPrice = typeof market === "string" ? Number.parseFloat(market) : market;

    if (isNaN(retailPrice) || isNaN(marketPrice) || retailPrice <= 0) return "N/A";

    const savings = ((retailPrice - marketPrice) / retailPrice) * 100;
    return savings <= 0 ? "0%" : `${Math.round(savings)}%`;
  };

  // Fetch favorites when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  // Fetch favorites from the backend
  const fetchFavorites = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("http://localhost:8080/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch favorites");
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      // Silently fail for favorites fetch
    }
  };

  // Check if a shoe is in favorites
  const isInFavorites = (shoeTitle: string): boolean => {
    return favorites.some(fav => fav.title === shoeTitle);
  };

  // Then in your handleSearch function, make sure the API response data is properly processed:
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;

  setIsLoading(true);
  setError(null);
  setResults([]);

  try {
    const token = await getAccessTokenSilently();
    const formattedQuery = query.trim().replace(/\s+/g, "-");

    const response = await fetch(`http://localhost:8080/shoes/${formattedQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch shoes");
    }

    const data = await response.json();
    console.log("API response:", data); // For debugging

    // If the API returns a single object, wrap it in an array
    const resultsArray = Array.isArray(data) ? data : [data];

    // Make sure each shoe has complete data
    const processedResults = resultsArray.map(shoe => ({
      ...shoe,
      // Ensure these properties are defined
      resell_links: shoe.resell_links || {},
      lowest_resell_prices: shoe.lowest_resell_prices || {},
    }));

    setResults(processedResults);
  } catch (err) {
    console.error("Search error:", err);
    setError(err instanceof Error ? err.message : "An unknown error occurred");
  } finally {
    setIsLoading(false);
  }
};

  // Handle card click to navigate to shoe detail page
  const handleViewClick = (shoe: ShoeData) => {
    // Generate unique ID from title if not available
    const shoeId = shoe.id || encodeURIComponent(shoe.title.toLowerCase().replace(/\s+/g, '-'));
    navigate(`/shoe/${shoeId}`, { state: { shoe } });
  };

  // Add shoe to favorites
  const addToFavorites = async (shoe: ShoeData) => {
    setFavoriteActionLoading(true);
    setFavoriteActionError(null);
    
    try {
      const token = await getAccessTokenSilently();
      
      const response = await fetch("http://localhost:8080/api/favorites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shoe),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add shoe to favorites");
      }
      
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Error adding to favorites:", err);
      setFavoriteActionError(err instanceof Error ? err.message : "Failed to add to favorites");
    } finally {
      setFavoriteActionLoading(false);
    }
  };
  
  // Remove shoe from favorites
  const removeFromFavorites = async (shoeTitle: string) => {
    setFavoriteActionLoading(true);
    setFavoriteActionError(null);
    
    try {
      const token = await getAccessTokenSilently();
      
      // URL encode the title for the API endpoint
      const encodedTitle = encodeURIComponent(shoeTitle);
      
      const response = await fetch(`http://localhost:8080/api/favorites/${encodedTitle}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove shoe from favorites");
      }
      
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Error removing from favorites:", err);
      setFavoriteActionError(err instanceof Error ? err.message : "Failed to remove from favorites");
    } finally {
      setFavoriteActionLoading(false);
    }
  };
  
  // Handle favorite button click based on current status
  const handleFavoriteClick = (shoe: ShoeData) => {
    if (isInFavorites(shoe.title)) {
      removeFromFavorites(shoe.title);
    } else {
      addToFavorites(shoe);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-prompt">
        <h2>Shoe Search</h2>
        <p>Please log in to search for shoes</p>
        <button className="login-button" onClick={() => loginWithRedirect()}>
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="shoe-container">
      {/* Search Bar */}
      <div className="search-bar">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for shoes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="search-button" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="spinner" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-state">
          <Loader2 className="spinner" />
          <span>Searching for shoes...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-alert">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Favorite Action Error */}
      {favoriteActionError && (
        <div className="error-alert">
          <h3>Favorite Error</h3>
          <p>{favoriteActionError}</p>
        </div>
      )}

      {/* Results - New Card-based UI */}
      {!isLoading && !error && results.length > 0 && !selectedShoe && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((shoe, index) => (
            <Card key={index} className="overflow-hidden bg-white hover:border-[#9b87f5]/70 transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                {/* Image container */}
                <div className="relative pb-[75%] bg-white">
                  <img
                    src={shoe.image_url}
                    alt={shoe.title}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 rounded-full ${
                      isInFavorites(shoe.title) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(shoe);
                    }}
                    disabled={favoriteActionLoading}
                  >
                    <Heart fill={isInFavorites(shoe.title) ? "currentColor" : "none"} size={20} />
                  </Button>
                </div>
                
                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 mb-1">{shoe.title}</h3>
                  <div className="text-xs text-gray-600 mb-1">
                    Lowest Ask
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-900">
                      {formatPrice(shoe.market_price)}
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-gray-700 hover:bg-gray-100"
                      onClick={() => handleViewClick(shoe)}
                    >
                      View
                    </Button>
                  </div>
                  <div className="text-xs flex items-center gap-1 mt-1.5 text-green-600">
                    <CheckCircle2 size={14} />
                    Size {shoe.user_size} Available
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* You can keep the detail view or remove if you'll handle it on a separate page */}
      {/* Detail View */}
      {selectedShoe && (
        <div className="detail-view">
          {/* Your existing detail view code */}
        </div>
      )}
    </div>
  );
}