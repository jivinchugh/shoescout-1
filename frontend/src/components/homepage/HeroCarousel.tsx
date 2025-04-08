import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
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
    return (
      <div className="w-full mb-10 relative overflow-hidden rounded-lg">
        <Carousel className="w-full">
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
                    <Button className="mt-4 bg-white text-black hover:bg-white/90">
                      {promo.ctaText}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 md:left-6 absolute" />
          <CarouselNext className="right-4 md:right-6 absolute " />
        </Carousel>
      </div>
    );
  }
  