
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShoeCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

export function ShoeCard({
  id,
  name,
  brand,
  price,
  image,
  isNew = false,
  isFavorite = false,
  onFavoriteToggle,
}: ShoeCardProps) {
  return (
    <Card className="shoe-card h-full transition-all duration-300 hover:shadow-md relative group">
      {isNew && (
        <Badge variant="default" className="shoe-card-badge absolute top-2 left-2 z-10 bg-shoescout-purple">
          New
        </Badge>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
        onClick={() => onFavoriteToggle?.(id)}
      >
        <Heart 
          className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} 
        />
        <span className="sr-only">Toggle favorite</span>
      </Button>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{brand}</div>
        <h3 className="mt-1 font-semibold leading-none tracking-tight line-clamp-2">
          {name}
        </h3>
        <div className="mt-3 flex flex-col">
          <span className="text-xs text-muted-foreground">Lowest Price</span>
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
          Compare Prices <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}