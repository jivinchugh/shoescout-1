import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Settings } from "lucide-react";
import { ShoeCard } from "@/components/ShoeCard";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import BrandSelector from "@/components/homepage/BrandSelector";

interface RecommendationSectionProps {
  favorites: any[];
  onFavoriteClick: (shoe: any) => void;
  isInFavorites: (shoeTitle: string) => boolean;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  favorites,
  onFavoriteClick,
  isInFavorites
}) => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  useEffect(() => {
    if (userPreferences.length > 0) {
      fetchRecommendations();
    }
  }, [userPreferences]);

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

  const saveUserPreferences = async (brands: string[]) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8080/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences: brands }),
      });

      if (response.ok) {
        setUserPreferences(brands);
        setShowPreferencesDialog(false);
        fetchRecommendations();
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
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

  const handleBrandSelect = (brands: string[]) => {
    setSelectedBrands(brands);
  };

  const handleSavePreferences = () => {
    saveUserPreferences(selectedBrands);
  };

  // If user has no preferences set, show setup prompt
  if (userPreferences.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 mb-8 recommendation-section">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
          <p className="text-muted-foreground mb-4">
            Select your favorite brands to receive personalized shoe recommendations based on your preferences.
          </p>
          <Dialog open={showPreferencesDialog} onOpenChange={setShowPreferencesDialog}>
            <DialogTrigger asChild>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Set Preferences
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] sm:w-full">
              <DialogHeader>
                <DialogTitle>Set Your Brand Preferences</DialogTitle>
                <DialogDescription>
                  Select up to 3 brands you're interested in to get personalized recommendations.
                </DialogDescription>
              </DialogHeader>
              <BrandSelector onSelect={handleBrandSelect} />
              <DialogFooter>
                <Button 
                  onClick={handleSavePreferences} 
                  disabled={selectedBrands.length === 0}
                  className="w-full"
                >
                  Save Preferences
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 recommendation-section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Recommended For You</h2>
          <p className="text-muted-foreground">
            Based on your preferences: {userPreferences.join(', ')}
          </p>
        </div>
        <Dialog open={showPreferencesDialog} onOpenChange={setShowPreferencesDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Update Preferences
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[425px] sm:w-full">
            <DialogHeader>
              <DialogTitle>Update Your Brand Preferences</DialogTitle>
              <DialogDescription>
                Select up to 3 brands you're interested in to get personalized recommendations.
              </DialogDescription>
            </DialogHeader>
            <BrandSelector onSelect={handleBrandSelect} />
            <DialogFooter>
              <Button 
                onClick={handleSavePreferences} 
                disabled={selectedBrands.length === 0}
                className="w-full"
              >
                Update Preferences
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loadingRecommendations ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading recommendations...</span>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recommendations.map((shoe, index) => (
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
            No recommendations available at the moment. Try updating your preferences or adding some favorites.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;