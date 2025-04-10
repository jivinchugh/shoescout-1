import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { CategoryNavMenu } from "@/components/homepage/CategoryNavMenu";
import { HeroCarousel } from "@/components/homepage/HeroCarousel";
import { useNavigate } from "react-router-dom";
import { ShoeCard } from "@/components/ShoeCard";
import { useAuth0 } from "@auth0/auth0-react";

interface Shoe {
  id?: string;
  title: string;
  description?: string;
  retail_price: string | number;
  market_price?: string | number;
  buy_now_price?: string | number;
  user_size?: number;
  brand?: string;
  image_url: string;
}

const promoItems = [
  {
    id: "promo1",
    title: "Only $5 Seller Fee",
    subtitle: "On All Supreme Products. Ends 4.14.25",
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Shop & Sell",
    ctaUrl: "#"
  },
  {
    id: "promo2",
    title: "New Yeezy Releases",
    subtitle: "Be the first to grab the newest colorways",
    imageUrl: "https://images.unsplash.com/photo-1574272635740-aa2e5c42edf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Shop Now",
    ctaUrl: "#"
  },
  {
    id: "promo3",
    title: "Summer Essentials",
    subtitle: "Get ready for summer with our curated collection",
    imageUrl: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Explore",
    ctaUrl: "#"
  },
];

const popularSearchTerms = ["Air Force 1", "Yeezy 350 v2"];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [filteredShoes, setFilteredShoes] = useState<Shoe[]>([]);
  const [favorites, setFavorites] = useState<Shoe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("relevance");

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrendingShoes();
      fetchFavorites();
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const fetchTrendingShoes = async () => {
    try {
      setLoading(true);
      setError(null);

      const randomIndex = Math.floor(Math.random() * popularSearchTerms.length);
      const randomTerm = popularSearchTerms[randomIndex];

      const token = await getAccessTokenSilently();
      const formattedQuery = randomTerm.trim().replace(/\s+/g, "-");

      const response = await fetch(`http://localhost:8080/shoes/${formattedQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch trending shoes");
      }

      const data = await response.json();
      const resultsArray = Array.isArray(data) ? data : [data];

      const shoesWithIds = resultsArray.map((shoe, index) => ({
        ...shoe,
        id: shoe.id || `trending-${index}-${encodeURIComponent(shoe.title.toLowerCase().replace(/\s+/g, '-'))}`
      }));

      setShoes(shoesWithIds);
      setFilteredShoes(shoesWithIds);
    } catch (err) {
      console.error("Error fetching trending shoes:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const isInFavorites = (shoeTitle: string): boolean => {
    return favorites.some(fav => fav.title === shoeTitle);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterShoes(term, sortOption);
  };

  const filterShoes = (term = searchTerm, sort: string = sortOption) => {
    let result = [...shoes];

    if (term) {
      const lowerTerm = term.toLowerCase();
      result = result.filter(
        (shoe) =>
          shoe.title.toLowerCase().includes(lowerTerm) ||
          (shoe.brand && shoe.brand.toLowerCase().includes(lowerTerm))
      );
    }

    if (sort) {
      switch (sort) {
        case "price-low":
          result.sort((a, b) => {
            const priceA = typeof a.retail_price === 'string' ? parseFloat(a.retail_price) : a.retail_price;
            const priceB = typeof b.retail_price === 'string' ? parseFloat(b.retail_price) : b.retail_price;
            return priceA - priceB;
          });
          break;
        case "price-high":
          result.sort((a, b) => {
            const priceA = typeof a.retail_price === 'string' ? parseFloat(a.retail_price) : a.retail_price;
            const priceB = typeof b.retail_price === 'string' ? parseFloat(b.retail_price) : b.retail_price;
            return priceB - priceA;
          });
          break;
        default:
          break;
      }
    }

    setFilteredShoes(result);
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    filterShoes(searchTerm, sort);
  };

  const handleFavoriteToggle = async (shoe: Shoe) => {
    try {
      const token = await getAccessTokenSilently();

      if (isInFavorites(shoe.title)) {
        const encodedTitle = encodeURIComponent(shoe.title);
        await fetch(`http://localhost:8080/api/favorites/${encodedTitle}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFavorites(favorites.filter(fav => fav.title !== shoe.title));
      } else {
        await fetch("http://localhost:8080/api/favorites", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shoe),
        });

        setFavorites([...favorites, shoe]);
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  const handleCardClick = (shoe: Shoe) => {
    const currentPosition = window.scrollY || window.pageYOffset;
    sessionStorage.setItem('homeScrollPosition', currentPosition.toString());

    const shoeId = shoe.id || encodeURIComponent(shoe.title.toLowerCase().replace(/\s+/g, '-'));
    navigate(`/shoe/${shoeId}`, { state: { shoe } });
  };

  useEffect(() => {
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem("homeScrollPosition");
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            behavior: "auto",
          });
        });
        sessionStorage.removeItem("homeScrollPosition");
      }
    };

    const handlePopState = () => {
      setTimeout(restoreScrollPosition, 50);
    };

    window.addEventListener("popstate", handlePopState);

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        restoreScrollPosition();
      }
    });

    const referrer = document.referrer;
    if (referrer && referrer.includes("/shoe/")) {
      restoreScrollPosition();
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", restoreScrollPosition);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white pt-20">
      <div className="border-b">
        <div className="container flex items-center justify-between h-14">
          <CategoryNavMenu />
        </div>
      </div>

      <main className="flex-1">
        <div className="container py-6">
          <HeroCarousel promos={promoItems} />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Trending Shoes</h1>
              <p className="text-muted-foreground mt-1">
                Find the best prices across top reseller platforms
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <p className="text-xl font-medium">Error loading shoes</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : filteredShoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <p className="text-xl font-medium">No shoes found</p>
              <p className="text-muted-foreground">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredShoes.map((shoe, index) => (
                <ShoeCard
                  key={shoe.id || index}
                  shoe={shoe}
                  index={index}
                  isFavorite={isInFavorites(shoe.title)}
                  onFavoriteClick={handleFavoriteToggle}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
