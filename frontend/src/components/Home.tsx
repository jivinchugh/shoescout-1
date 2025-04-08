import { useState, useEffect } from "react";
import { ShoeCard } from "@/components/homepage/ShoeCard";
import { Button } from "@/components/ui/button";
import { Loader, ArrowRight } from "lucide-react";
import { CategoryNavMenu } from "@/components/homepage/CategoryNavMenu";
import { HeroCarousel } from "@/components/homepage/HeroCarousel";

interface Shoe {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew: boolean;
}

// Sample shoes data (in a real app, this would come from an API)
const sampleShoes: Shoe[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High OG",
    brand: "Nike",
    price: 180,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1974&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: "2",
    name: "Yeezy Boost 350 V2",
    brand: "Adidas",
    price: 220,
    image: "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?q=80&w=2000&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "3",
    name: "Chuck Taylor All Star",
    brand: "Converse",
    price: 60,
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=2021&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "4",
    name: "Old Skool",
    brand: "Vans",
    price: 70,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1996&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "5",
    name: "990v5",
    brand: "New Balance",
    price: 175,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2071&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: "6",
    name: "Suede Classic",
    brand: "Puma",
    price: 70,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "7",
    name: "Classic Leather",
    brand: "Reebok",
    price: 80,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "8",
    name: "Air Force 1",
    brand: "Nike",
    price: 100,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: "9",
    name: "Ultra Boost",
    brand: "Adidas",
    price: 180,
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=2031&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "10",
    name: "Air Max 90",
    brand: "Nike",
    price: 120,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "11",
    name: "Stan Smith",
    brand: "Adidas",
    price: 80,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "12",
    name: "Cortez",
    brand: "Nike",
    price: 70,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop",
    isNew: false,
  },
];

// Sample promo data for hero carousel
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
    title: "New yeezy Releases",
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

export default function Home() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [filteredShoes, setFilteredShoes] = useState<Shoe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortOption, setSortOption] = useState("relevance");

  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setShoes(sampleShoes);
      setFilteredShoes(sampleShoes);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterShoes(term, sortOption);
  };

  const filterShoes = (
    term = searchTerm,
    sort: string = sortOption
  ) => {
    let result = [...shoes];

    // Apply search filter
    if (term) {
      const lowerTerm = term.toLowerCase();
      result = result.filter(
        (shoe) =>
          shoe.name.toLowerCase().includes(lowerTerm) ||
          shoe.brand.toLowerCase().includes(lowerTerm)
      );
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          result = result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
          break;
        // Add other sort options as needed
        default:
          break;
      }
    }

    setFilteredShoes(result);
    setVisibleCount(8); // Reset pagination when filtering
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    filterShoes(searchTerm, sort);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredShoes.length));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/90 via-purple-900/5 pt-20">
      
      
      <div className="border-b">
        <div className="container flex items-center justify-between h-14">
          <CategoryNavMenu />
        </div>
      </div>
      
      <main className="flex-1">
        <div className="container py-6">
          {/* Hero Carousel */}
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
              <Loader className="h-8 w-8 animate-spin text-shoescout-purple" />
            </div>
          ) : filteredShoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <p className="text-xl font-medium">No shoes found</p>
              <p className="text-muted-foreground">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredShoes.slice(0, visibleCount).map((shoe) => (
                  <ShoeCard
                    key={shoe.id}
                    {...shoe}
                    isFavorite={favorites.includes(shoe.id)}
                    onFavoriteToggle={toggleFavorite}
                  />
                ))}
              </div>
              
              {visibleCount < filteredShoes.length && (
                <div className="mt-8 flex justify-center">
                  <Button onClick={loadMore} variant="outline" className="flex items-center gap-2">
                    Load More <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      
    </div>
  );
}