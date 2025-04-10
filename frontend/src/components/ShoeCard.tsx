import React from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ShoeData {
  title: string;
  description?: string;
  retail_price: string | number;
  market_price?: string | number;
  buy_now_price?: string | number;
  user_size?: number;
  brand?: string;
  image_url: string;
  id?: string;
}

interface ShoeCardProps {
  shoe: ShoeData;
  index?: number;
  isFavorite: boolean;
  onFavoriteClick: (shoe: ShoeData) => void;
  onCardClick: (shoe: ShoeData) => void;
}

// Format price with dollar sign and commas
const formatPrice = (price: string | number): string => {
  if (price === "N/A") return "N/A";

  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
  if (isNaN(numPrice)) return "N/A";

  return `$${numPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const ShoeCard: React.FC<ShoeCardProps> = ({
  shoe,
  index = 0,
  isFavorite,
  onFavoriteClick,
  onCardClick,
}) => {
  return (
    <motion.div
  key={index}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: 0.05 }}
  whileHover={{ y: -4 }} // Moves entire card up slightly on hover
>
  <Card className="bg-transparent shadow-none border-none rounded-none p-0 m-0 overflow-hidden cursor-pointer" onClick={() => onCardClick(shoe)}>

        <div className="relative">
          {/* Image container */}
          <div className="relative pb-[75%] bg-white">
            <img
              src={shoe.image_url}
              alt={shoe.title}
              className="absolute inset-0 w-full h-full object-contain p-2"
            />
            <button
              className={`absolute top-2 right-2 rounded-full p-2 ${
                isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click from triggering
                onFavoriteClick(shoe);
              }}
            >
              <Heart fill={isFavorite ? "currentColor" : "none"} size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-3">
            <h3 className="font-medium text-gray-800 mb-1">{shoe.title}</h3>
            <div className="text-xs text-gray-600 mb-1">
              Retail Price
            </div>
            <div className="flex items-center justify-between">
              <div className="font-bold text-gray-900">
                {formatPrice(shoe.retail_price)}
              </div>
            </div>
            {shoe.user_size && (
              <div className="text-xs flex items-center gap-1 mt-1.5 text-green-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 14L8.23309 16.4248C8.66178 16.7463 9.26772 16.6728 9.60705 16.2581L18 6" />
                </svg>
                Size {shoe.user_size} Available
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};