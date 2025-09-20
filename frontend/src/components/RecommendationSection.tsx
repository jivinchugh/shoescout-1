import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserPreferences } from "@/context/UserPreferencesProvider";
import { Button } from "@/components/ui/button";
import { Heart, Loader, Settings, RefreshCw } from "lucide-react";
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
  const { userPreferences, setUserPreferences, fetchUserPreferences } = useUserPreferences();
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const hasFetchedInitial = useRef(false);
  const isFetchingRef = useRef(false);

  // Only fetch recommendations once after preferences are available
  useEffect(() => {
    if (!hasFetchedInitial.current && userPreferences.length > 0) {
      hasFetchedInitial.current = true;
      fetchRecommendations();
    }
  }, [userPreferences]);

  const saveUserPreferences = async (brands: string[]) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-preferences`, {
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
        // Do not auto-fetch recommendations here; user can refresh manually
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  const fetchRecommendations = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoadingRecommendations(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations`, {
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
      isFetchingRef.current = false;
    }
  };

  // Function to manually refresh recommendations by fetching new data from API
  const refreshRecommendations = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoadingRecommendations(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        console.log(`Refreshed with ${data.recommendations?.length || 0} new recommendations`);
      } else {
        console.error('Failed to refresh recommendations');
      }
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
      isFetchingRef.current = false;
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRecommendations}
            disabled={loadingRecommendations}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <RefreshCw className={`h-4 w-4 ${loadingRecommendations ? 'animate-spin' : ''}`} />
            {loadingRecommendations ? 'Refreshing...' : 'Refresh'}
          </Button>
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
      </div>

      {loadingRecommendations ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
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