"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Search, Loader2, Heart, Tag } from "lucide-react";
import { motion } from "framer-motion";
import "./Searchstyles.css"; // Import the CSS file

interface ShoeData {
  title: string;
  description: string;
  retail_price: string | number;
  market_price: string | number;
  buy_now_price: string | number;
  user_size: number;
  brand: string;
  image_url: string;
}

export default function ShoeSearch() {
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

  // Handle the search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const token = await getAccessTokenSilently();

      // Format query for URL (replace spaces with dashes)
      const formattedQuery = query.trim().replace(/\s+/g, "-");

      // Make API call to backend
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

      // If the API returns a single object, wrap it in an array
      const resultsArray = Array.isArray(data) ? data : [data];
      setResults(resultsArray);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle card click to show details
  const handleCardClick = (shoe: ShoeData) => {
    setSelectedShoe(shoe);
  };

  // Close detail view
  const closeDetail = () => {
    setSelectedShoe(null);
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

      {/* Results */}
      {!isLoading && !error && results.length > 0 && !selectedShoe && (
        <div className="results-grid">
          {results.map((shoe, index) => (
            <div key={index} className="shoe-card">
              <div className="shoe-image-container" onClick={() => handleCardClick(shoe)}>
                {shoe.image_url ? (
                  <img src={shoe.image_url} alt={shoe.title} className="shoe-image" />
                ) : (
                  <div className="bg-muted text-muted-foreground flex items-center justify-center h-full">No image available</div>
                )}
                {calculateSavings(shoe.retail_price, shoe.market_price) !== "0%" &&
                  calculateSavings(shoe.retail_price, shoe.market_price) !== "N/A" && (
                    <div className="discount-badge">
                      Save {calculateSavings(shoe.retail_price, shoe.market_price)}
                    </div>
                  )}
              </div>
              <div className="shoe-details">
                <h3 className="shoe-title">{shoe.title}</h3>
                <p className="shoe-brand">
                  <Tag className="brand-icon" /> {shoe.brand}
                </p>
                <div className="price-section">
                  <div>
                    <span className="retail-price">Retail Price: </span>
                    <span className="retail-price">{formatPrice(shoe.retail_price)}</span>
                  </div>
                  <div>
                    <span className="user-size">Your Size: </span>
                    <span className="user-size">{shoe.user_size}</span>
                  </div>
                </div>
              </div>
              <motion.button 
                className={`favorite-button ${isInFavorites(shoe.title) ? 'favorited' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteClick(shoe);
                }}
                disabled={favoriteActionLoading}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                {favoriteActionLoading ? (
                  <Loader2 className="spinner" />
                ) : (
                  <Heart className={isInFavorites(shoe.title) ? "filled-heart" : ""} />
                )}
              </motion.button>
            </div>
          ))}
        </div>
      )}

      {/* Detail View */}
      {selectedShoe && (
        <div className="detail-view">
          <div className="detail-content">
            <div className="detail-header">
              <h2>{selectedShoe.title}</h2>
              <button className="close-button" onClick={closeDetail}>
                Close
              </button>
            </div>
            <div className="detail-body">
              <div className="detail-image-container">
                {selectedShoe.image_url ? (
                  <img src={selectedShoe.image_url} alt={selectedShoe.title} className="detail-image" />
                ) : (
                  <div>No image available</div>
                )}
              </div>
              <div className="detail-info">
                <p className="shoe-brand">
                  <Tag className="brand-icon" /> {selectedShoe.brand}
                </p>
                <p
                  className="shoe-description"
                  dangerouslySetInnerHTML={{ __html: selectedShoe.description || "No description available" }}
                />
                <div className="price-grid">
                  <div className="price-item">
                    <span>Retail Price</span>
                    <span>{formatPrice(selectedShoe.retail_price)}</span>
                  </div>
                  <div className="price-item">
                    <span>Your Size</span>
                    <span>{selectedShoe.user_size}</span>
                  </div>
                </div>
                {calculateSavings(selectedShoe.retail_price, selectedShoe.market_price) !== "0%" &&
                  calculateSavings(selectedShoe.retail_price, selectedShoe.market_price) !== "N/A" && (
                    <div className="savings-banner">
                      You save {calculateSavings(selectedShoe.retail_price, selectedShoe.market_price)} off retail price!
                    </div>
                  )}
                <div className="action-buttons">
                  <motion.button 
                    className={`add-to-favorites ${isInFavorites(selectedShoe.title) ? 'favorited' : ''}`}
                    onClick={() => handleFavoriteClick(selectedShoe)}
                    disabled={favoriteActionLoading}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: isInFavorites(selectedShoe.title) ? 
                        "rgba(255, 200, 200, 1)" : 
                        "rgba(245, 245, 245, 1)" 
                    }}
                    animate={
                      favoriteActionLoading ? 
                      { scale: [1, 1.05, 1] } : 
                      isInFavorites(selectedShoe.title) ? 
                        { backgroundColor: "#fff0f0" } : 
                        { backgroundColor: "white" }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {favoriteActionLoading ? (
                      <Loader2 className="spinner" />
                    ) : (
                      <>
                        <Heart className={isInFavorites(selectedShoe.title) ? "filled-heart" : "button-icon"} />
                        {isInFavorites(selectedShoe.title) ? "Remove from Favorites" : "Add to Favorites"}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}