import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react";
import { ShoeCard } from "@/components/ShoeCard";
import { useNavigate } from "react-router-dom";

interface HomeRecommendationsSectionProps {
  favorites: any[];
  onFavoriteClick: (shoe: any) => void;
  isInFavorites: (shoeTitle: string) => boolean;
}

const HomeRecommendationsSection: React.FC<HomeRecommendationsSectionProps> = ({
  favorites,
  onFavoriteClick,
  isInFavorites
}) => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  useEffect(() => {
    if (userPreferences.length > 0) {
      fetchRecommendations();
    }
  }, [userPreferences]);

  // Listen for preferences updates from navbar
  useEffect(() => {
    const handlePreferencesUpdate = () => {
      fetchUserPreferences();
    };

    window.addEventListener('preferencesUpdated', handlePreferencesUpdate);
    return () => {
      window.removeEventListener('preferencesUpdated', handlePreferencesUpdate);
    };
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8080/api/user-preferences', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserPreferences(data.preferences || []);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8080/api/recommendations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleViewClick = (shoe: any) => {
    const shoeId = shoe.id || encodeURIComponent(shoe.title.toLowerCase().replace(/\s+/g, '-'));
    navigate(`/shoe/${shoeId}`, { state: { shoe } });
  };

  // Don't show anything if user has no preferences
  if (userPreferences.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 home-recommendations-section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Recommended For You</h2>
          <p className="text-muted-foreground mt-1">
            Based on your preferences: {userPreferences.join(', ')}
          </p>
        </div>
      </div>

      {loadingRecommendations ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading recommendations...</span>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.slice(0, 8).map((shoe, index) => (
            <ShoeCard
              key={index}
              shoe={shoe}
              index={index}
              isFavorite={isInFavorites(shoe.title)}
              onFavoriteClick={onFavoriteClick}
              onCardClick={handleViewClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No recommendations available at the moment. Try updating your preferences.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomeRecommendationsSection;