import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Heart, Loader2, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLayout } from "../components/AuthLayout";
import "../components/Searchstyles.css";
import { Card } from "@/components/ui/card";

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

const Favorites = () => {
    const navigate = useNavigate();
    const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
    const [favorites, setFavorites] = useState<ShoeData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favoriteActionLoading, setFavoriteActionLoading] = useState(false);
    const [favoriteActionError, setFavoriteActionError] = useState<string | null>(null);
    const [removingShoe, setRemovingShoe] = useState<string | null>(null);

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
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch favorites from the backend
    const fetchFavorites = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = await getAccessTokenSilently();
            const apiUrl = import.meta.env.VITE_API_URL.endsWith('/')
                ? `${import.meta.env.VITE_API_URL}api/favorites`
                : `${import.meta.env.VITE_API_URL}/api/favorites`;

            const response = await fetch(apiUrl, {
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
            setError(err instanceof Error ? err.message : "An error occurred while fetching favorites");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle card click to navigate to ShoeDetail page
    const handleCardClick = (shoe: ShoeData) => {
        const shoeId = shoe.id || encodeURIComponent(shoe.title.toLowerCase().replace(/\s+/g, '-'));
        navigate(`/shoe/${shoeId}`, { state: { shoe } });
    };

    // Remove shoe from favorites
    const removeFromFavorites = async (shoeTitle: string) => {
        setFavoriteActionLoading(true);
        setFavoriteActionError(null);
        setRemovingShoe(shoeTitle);

        try {
            const token = await getAccessTokenSilently();

            // URL encode the title for the API endpoint
            const encodedTitle = encodeURIComponent(shoeTitle);

            const apiUrl = import.meta.env.VITE_API_URL.endsWith('/')
                ? `${import.meta.env.VITE_API_URL}api/favorites/${encodedTitle}`
                : `${import.meta.env.VITE_API_URL}/api/favorites/${encodedTitle}`;

            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to remove shoe from favorites");
            }

            // Update state after successful removal
            setFavorites(favorites.filter(shoe => shoe.title !== shoeTitle));
        }
        catch (err) {
            console.error("Error removing from favorites:", err);
            setFavoriteActionError(err instanceof Error ? err.message : "Failed to remove from favorites");
        } finally {
            setFavoriteActionLoading(false);
            // We keep the removingShoe state a bit longer for animation purposes
            setTimeout(() => setRemovingShoe(null), 300);
        }
    };

    // Add a helper function to check if a shoe is in favorites
    const isInFavorites = (shoeTitle: string): boolean => {
        return favorites.some(fav => fav.title === shoeTitle);
    };

    // Add a function to add a shoe back to favorites 
    const addToFavorites = async (shoe: ShoeData) => {
        setFavoriteActionLoading(true);
        setFavoriteActionError(null);

        try {
            const token = await getAccessTokenSilently();

            const apiUrl = import.meta.env.VITE_API_URL.endsWith('/')
                ? `${import.meta.env.VITE_API_URL}api/favorites`
                : `${import.meta.env.VITE_API_URL}/api/favorites`;

            const response = await fetch(apiUrl, {
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

    // Create a function to handle favorite toggle
    const handleFavoriteToggle = (shoe: ShoeData) => {
        if (isInFavorites(shoe.title)) {
            removeFromFavorites(shoe.title);
        } else {
            addToFavorites(shoe);
        }
    };

    const content = (
        <section className="relative pt-40 pb-16 overflow-hidden min-h-screen">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-[10%] top-[20%] h-[40%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center mb-8">
                    <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl animate-slide-down">
                        My <span className="text-gradient">Favorite Shoes</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground animate-slide-down [animation-delay:75ms]">
                        View and manage your collection of favorite shoes
                    </p>
                </div>

                <div className="favorites-content">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="loading-state">
                            <Loader2 className="spinner" />
                            <span>Loading your favorites...</span>
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
                            <h3>Error</h3>
                            <p>{favoriteActionError}</p>
                        </div>
                    )}

                    {/* No Favorites */}
                    {!isLoading && !error && favorites.length === 0 && (
                        <div className="no-favorites animate-fade-in">
                            <Heart className="empty-heart" />
                            <h3>You haven't saved any favorites yet</h3>
                            <p>Search for shoes and click the heart icon to add them to your favorites</p>
                        </div>
                    )}

                    {/* Favorites Grid - Updated to match Dashboard style */}
                    {!isLoading && !error && favorites.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in max-w-6xl mx-auto">
                            <AnimatePresence>
                                {favorites.map((shoe, index) => (
                                    <motion.div
                                        key={shoe.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card
                                            className="overflow-hidden bg-white hover:border-[#9b87f5]/70 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                            onClick={() => handleCardClick(shoe)}
                                        >
                                            <div className="relative">
                                                {/* Image container */}
                                                <div className="relative pb-[75%] bg-white">
                                                    {shoe.image_url ? (
                                                        <img
                                                            src={shoe.image_url}
                                                            alt={shoe.title}
                                                            className="absolute inset-0 w-full h-full object-contain p-2"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-400">
                                                            No image available
                                                        </div>
                                                    )}
                                                    <button
                                                        className="absolute top-2 right-2 rounded-full p-2 text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent card click from triggering
                                                            removeFromFavorites(shoe.title);
                                                        }}
                                                        disabled={favoriteActionLoading && removingShoe === shoe.title}
                                                    >
                                                        {favoriteActionLoading && removingShoe === shoe.title ? (
                                                            <Loader2 className="animate-spin" size={20} />
                                                        ) : (
                                                            <Heart fill="currentColor" size={20} />
                                                        )}
                                                    </button>

                                                    {/* Show discount badge if applicable */}
                                                    {calculateSavings(shoe.retail_price, shoe.market_price) !== "0%" &&
                                                        calculateSavings(shoe.retail_price, shoe.market_price) !== "N/A" && (
                                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                                Save {calculateSavings(shoe.retail_price, shoe.market_price)}
                                                            </div>
                                                        )}
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
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return (
            <AuthLayout>
                <section className="relative pt-32 pb-16 min-h-[80vh] flex items-center">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute -left-[10%] top-[20%] h-[40%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
                    </div>
                    <div className="container mx-auto px-4">
                        <div className="auth-prompt animate-fade-in max-w-md mx-auto text-center">
                            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                                My <span className="text-gradient">Favorites</span>
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Please log in to view your favorite shoes
                            </p>
                            <button
                                className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:translate-y-[-2px]"
                                onClick={() => loginWithRedirect()}
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </section>
            </AuthLayout>
        );
    }

    // Return the Favorites content inside the AuthLayout component
    return <AuthLayout>{content}</AuthLayout>;
};

export default Favorites;