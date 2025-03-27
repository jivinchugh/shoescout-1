import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { useTheme } from '../context/ThemeProvider';

const brands = [
  {
    name: "Nike",
    lightLogo: "https://pngimg.com/d/nike_PNG6.png",
    darkLogo: "https://pngimg.com/d/nike_PNG4.png"
  },
  {
    name: "Adidas",
    lightLogo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Adidas_logo.png",
    darkLogo: "https://i0.wp.com/gpng.net/wp-content/uploads/Adidas-Logo-Png-White.png?fit=2048%2C2048&ssl=1"
  },
  {
    name: "Puma",
    lightLogo: "https://1000logos.net/wp-content/uploads/2021/04/Puma-logo.png",
    darkLogo: "https://i.ibb.co/Vc1XRZc5/puma-white-logo-image-png-70175169477457451fjsxofkt-removebg-preview.png"
  },
  {
    name: "New Balance",
    lightLogo: "https://cdn.freebiesupply.com/logos/large/2x/new-balance-2-logo-black-and-white.png",
    darkLogo: "https://www.freepnglogos.com/uploads/new-balance-png-logo/live-event-sports-streams-new-balance-png-logo-4.png"
  },
  {
    name: "Louis Vuitton",
    lightLogo: "https://i.ibb.co/svRCnTy1/jordan-removebg-preview.png",
    darkLogo: "https://i.ibb.co/bj3WyzC8/air-jordan-logo-black-and-white-removebg-preview.png"
  },
  {
    name: "Under Armour",
    lightLogo: "https://i.ibb.co/35DMYxss/Vans-Logo-1966-removebg-preview.png",
    darkLogo: "https://i.ibb.co/9kD6dJk5/vans-white-logo-free-png-701751694712364lfmvpiyiog-removebg-preview.png"
  }
];

const BrandCard = ({
  lightLogo,
  darkLogo,
  name,
}: {
  lightLogo: string;
  darkLogo: string;
  name: string;
}) => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? darkLogo : lightLogo;

  return (
    <div
      className={cn(
        "relative aspect-square w-40 cursor-pointer overflow-hidden rounded-lg border p-3",
        "border--950/[.1] bg--950/[.01] hover:bg-gray-950/[.05]",
        "dark:border--50/[.1] dark:bg--50/[.10] dark:hover:bg-gray-50/[.15]",
        "flex flex-col items-center justify-center gap-1"
      )}
    >
      <img 
        className="w-34 h-34 object-contain"
        alt={`${name} logo`} 
        src={logoSrc} 
      />
    </div>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <p className="text-balance font-display font-bold leading-tight tracking-tight sm:text-1xl md:text-3xl animate-slide-down [animation-delay:75ms]">
        Top Brands at <span className="text-gradient">ShoeScout</span>
      </p>
      <br />
      <Marquee pauseOnHover className="[--duration:20s]">
        {brands.map((brand) => (
          <BrandCard 
            key={brand.name} 
            name={brand.name}
            lightLogo={brand.lightLogo}
            darkLogo={brand.darkLogo}
          />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}