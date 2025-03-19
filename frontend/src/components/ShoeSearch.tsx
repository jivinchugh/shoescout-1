"use client";

import React from "react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Search, Loader2, Heart, ShoppingBag, Tag } from "lucide-react";
import "./SearchStyles.css"; // Import the CSS file

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
    const retailNum = typeof retail === "string" ? Number.parseFloat(retail) : retail;
    const marketNum = typeof market === "string" ? Number.parseFloat(market) : market;

    if (isNaN(retailNum) || isNaN(marketNum) || retailNum <= 0) return "N/A";

    const savings = ((retailNum - marketNum) / retailNum) * 100;
    return savings > 0 ? `${savings.toFixed(0)}%` : "0%";
  };

  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      // Get the access token from Auth0
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

      {/* Results */}
      {!isLoading && !error && results.length > 0 && !selectedShoe && (
        <div className="results-grid">
          {results.map((shoe, index) => (
            <div key={index} className="shoe-card" onClick={() => handleCardClick(shoe)}>
              <div className="shoe-image-container">
                {shoe.image_url ? (
                  <img src={shoe.image_url} alt={shoe.title} className="shoe-image" />
                ) : (
                  <div>No image available</div>
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
                {/* Description removed from normal card */}
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
                <div className="market-price">
                  <span>Market Price:</span>
                  <span className="price-value">{formatPrice(shoe.market_price)}</span>
                </div>
                <div className="buy-now-price">
                  <span>Buy Now:</span>
                  <span className="price-value">{formatPrice(shoe.buy_now_price)}</span>
                </div>
              </div>
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
                {/* Show description in detail view */}
                <p className="shoe-description">{selectedShoe.description || "No description available"}</p>
                <div className="price-grid">
                  <div className="price-item">
                    <span>Retail Price</span>
                    <span>{formatPrice(selectedShoe.retail_price)}</span>
                  </div>
                  <div className="price-item">
                    <span>Market Price</span>
                    <span>{formatPrice(selectedShoe.market_price)}</span>
                  </div>
                  <div className="price-item">
                    <span>Buy Now Price</span>
                    <span>{formatPrice(selectedShoe.buy_now_price)}</span>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}