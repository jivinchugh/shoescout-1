import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface HeroPromo {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
}

interface HeroCarouselProps {
  promos: HeroPromo[];
}

export function HeroCarousel({ promos }: HeroCarouselProps) {
  // Create API reference to control the carousel
  const [api, setApi] = useState<any>(null);

  // Set up auto-rotation when the component mounts
  useEffect(() => {
    if (!api) return;

    // Define the interval for auto-rotation (5 seconds = 5000ms)
    const autoplayInterval = 3000;
    
    // Set up the interval to move to the next slide
    const autoplayTimer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        // If at the end, go back to the first slide
        api.scrollTo(0);
      }
    }, autoplayInterval);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(autoplayTimer);
    };
  }, [api]);

  return (
    <div className="w-full mb-10 relative overflow-hidden rounded-lg">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {promos.map((promo) => (
            <CarouselItem key={promo.id}>
              <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden rounded-lg">
                <div className="absolute inset-0">
                  <img 
                    src={promo.imageUrl} 
                    alt={promo.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12 bg-gradient-to-r from-black/60 to-transparent">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                    {promo.title}
                  </h2>
                  {promo.subtitle && (
                    <p className="text-sm md:text-base text-white/90 mb-4">
                      {promo.subtitle}
                    </p>
                  )}
                  {/* <Button className="mt-4 bg-white text-black hover:bg-white/90">
                    {promo.ctaText}
                  </Button> */}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* CarouselPrevious and CarouselNext buttons removed */}
      </Carousel>
    </div>
  );
}
