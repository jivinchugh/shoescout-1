import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useShoeResults } from "@/context/ShoeResultsProvider";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const menBrands = [
  {
    name: "Nike",
    logo: "https://pngimg.com/d/nike_PNG6.png", // You'll need to add these logo files
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Adidas_logo.png",
  },
  {
    name: "Puma",
    logo: "https://1000logos.net/wp-content/uploads/2021/04/Puma-logo.png",
  },
  {
    name: "Converse",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Converse_logo.svg/2560px-Converse_logo.svg.png",
  },
  {
    name: "New Balance",
    logo: "https://logos-world.net/wp-content/uploads/2020/09/New-Balance-Logo-1972-2006.png",
  },
  {
    name: "Hoka",
    logo: "https://vectorseek.com/wp-content/uploads/2023/08/Hoka-Black-Logo-Vector.svg--300x82.png",
  },
];

const womenBrands = [
  {
    name: "Birkenstock",
    logo: "https://cdn.worldvectorlogo.com/logos/birkenstock-1.svg",
  },
  {
    name: "Ugg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/UGG_logo.svg/2560px-UGG_logo.svg.png",
  },
  {
    name: "Skechers",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/SKECHERS_logo.png/1200px-SKECHERS_logo.png",
  },
  {
    name: "Asics",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/asics-6-logo-black-and-white.png",
  },
  {
    name: "Nike",
    logo: "https://pngimg.com/d/nike_PNG6.png",
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Adidas_logo.png",
  },
];

export function CategoryNavMenu() {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const { setResults, setIsLoading, setError } = useShoeResults();

  const handleBrandClick = async (brandName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getAccessTokenSilently();
      const formattedQuery = brandName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      const response = await fetch(
        `http://localhost:8080/shoes/${formattedQuery}?type=shoes`, // Added type parameter
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch shoes");
      }

      const data = await response.json();

      // Client-side filtering to ensure only shoes are displayed
      const shoesOnly = Array.isArray(data)
        ? data.filter((item) => {
            const title = item.title.toLowerCase();
            // Keywords that indicate the item is NOT a shoe
            const excludeKeywords = [
              "socks",
              "bag",
              "backpack",
              "wallet",
              "hat",
              "cap",
              "shorts",
              "shirt",
              "t-shirt",
              "hoodie",
              "jacket",
            ];
            // Keywords that typically indicate the item IS a shoe
            const includeKeywords = [
              "shoe",
              "sneaker",
              "trainer",
              "boot",
              "sandal",
              "loafer",
              "cleat",
              "heel",
              "slipper",
              "flat",
              "running",
              "basketball",
              "football",
              "tennis",
              "hiking",
              "slide",
              "asics",
              "nike",
              "adidas",
              "puma",
              "reebok",
              "converse",
              "new balance",
              "vans",
              "under armour",
              "fila",
              "brooks",
              "mizuno",
              "saucony",
              "hoka",
              "birkenstock",
              "ugg",
              "skechers",
            ];

            // Check if the title contains any exclude keywords
            const hasExcludeWord = excludeKeywords.some((keyword) =>
              title.includes(keyword)
            );
            if (hasExcludeWord) return false;

            // Check if the title contains any include keywords or contains the brand name + a shoe-related term
            const hasIncludeWord = includeKeywords.some((keyword) =>
              title.includes(keyword)
            );
            const isBrandShoe =
              title.includes(brandName.toLowerCase()) &&
              (title.includes("shoe") ||
                title.includes("sneaker") ||
                title.includes("trainer"));

            return hasIncludeWord || isBrandShoe;
          })
        : [];

      setResults(shoesOnly);

      // Navigate to dashboard and scroll to results
      navigate("/dashboard");
      setTimeout(() => {
        document
          .getElementById("search-results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NavigationMenu className="max-w-full justify-center">
      <NavigationMenuList className="space-x-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-lg">
            Men
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-full bg-popover border-b shadow-lg animate-in fade-in-10">
              <div className="container flex flex-col items-center justify-center mx-auto py-8">
                <h2 className="text-xl font-large leading-none mb-6">
                  Popular Men's Brands
                </h2>
                <div className="grid grid-cols-3 gap-8 w-[800px]">
                  {menBrands.map((brand) => (
                    <button
                      key={brand.name}
                      onClick={() =>
                        handleBrandClick(brand.name + " mens shoes")
                      }
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors"
                    >
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="h-12 w-auto mb-2 object-contain"
                      />
                      <span className="text-sm font-medium">{brand.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-lg">
            Women
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-full bg-popover border-b shadow-lg animate-in fade-in-10">
              <div className="container flex flex-col items-center justify-center mx-auto py-8">
                <h2 className="text-xl font-large leading-none mb-6">
                  Popular Women's Brands
                </h2>
                <div className="grid grid-cols-3 gap-8 w-[800px]">
                  {womenBrands.map((brand) => (
                    <button
                      key={brand.name}
                      onClick={() =>
                        handleBrandClick(brand.name + " womens shoes")
                      }
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors"
                    >
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="h-12 w-auto mb-2 object-contain"
                      />
                      <span className="text-sm font-medium">{brand.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
