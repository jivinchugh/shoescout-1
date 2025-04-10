import { useState, useEffect } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useShoeResults } from "@/context/ShoeResultsProvider";
import { ShoeCard } from "@/components/ShoeCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { results, isLoading, error } = useShoeResults();
  const [favorites, setFavorites] = useState([]);

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
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 pt-4 pb-16">
          <div className="flex flex-col items-center justify-center">
            {!isLoading && !error && results.length > 0 && (
              <div className="w-full" style={{ marginTop: '6rem' }}>
                <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((shoe, index) => (
                    <ShoeCard
                      key={index}
                      shoe={shoe}
                      index={index}
                      isFavorite={isInFavorites(shoe.title)}
                      onFavoriteClick={handleFavoriteClick}
                      onCardClick={handleViewClick}
                    />
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