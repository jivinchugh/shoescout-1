import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShoeCard } from '@/components/ShoeCard';

interface DynamicCarouselProps {
  items: any[];
  itemsPerPage?: number;
  onFavoriteClick: (shoe: any) => void;
  isInFavorites: (shoeTitle: string) => boolean;
  onCardClick: (shoe: any) => void;
  className?: string;
}

export const DynamicCarousel: React.FC<DynamicCarouselProps> = ({
  items,
  itemsPerPage = 4,
  onFavoriteClick,
  isInFavorites,
  onCardClick,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [responsiveItemsPerPage, setResponsiveItemsPerPage] = useState(itemsPerPage);

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setResponsiveItemsPerPage(1); // sm
      } else if (width < 1024) {
        setResponsiveItemsPerPage(2); // md
      } else if (width < 1280) {
        setResponsiveItemsPerPage(3); // lg
      } else {
        setResponsiveItemsPerPage(4); // xl
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(items.length / responsiveItemsPerPage);

  useEffect(() => {
    // Reset to first page when items per page changes
    setCurrentPage(0);
  }, [responsiveItemsPerPage]);

  useEffect(() => {
    // Calculate which items to display based on current page
    const startIndex = currentPage * responsiveItemsPerPage;
    const endIndex = startIndex + responsiveItemsPerPage;
    setDisplayedItems(items.slice(startIndex, endIndex));
  }, [currentPage, items, responsiveItemsPerPage]);

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

  // Don't render if no items
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`} role="region" aria-label="Shoe recommendations carousel">
      {/* Navigation Arrows */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          disabled={totalPages <= 1}
          className="h-12 w-12 rounded-full bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 hover:shadow-lg"
          aria-label={`Go to previous page (${currentPage}/${totalPages})`}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex items-center space-x-3" role="tablist" aria-label="Carousel page indicators">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentPage
                  ? 'bg-primary scale-110'
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-105'
              }`}
              role="tab"
              aria-selected={index === currentPage}
              aria-label={`Go to page ${index + 1} of ${totalPages}`}
              tabIndex={index === currentPage ? 0 : -1}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={totalPages <= 1}
          className="h-12 w-12 rounded-full bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 hover:shadow-lg"
          aria-label={`Go to next page (${currentPage + 2}/${totalPages})`}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Carousel Content */}
      <div className="overflow-hidden" role="tabpanel" aria-live="polite">
        <div 
          className="grid transition-all duration-500 ease-in-out gap-4 sm:gap-6"
          style={{
            gridTemplateColumns: `repeat(${Math.min(responsiveItemsPerPage, displayedItems.length)}, 1fr)`
          }}
        >
          {displayedItems.map((shoe, index) => (
            <div
              key={`${currentPage}-${index}`}
              className="flex-shrink-0 transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <ShoeCard
                shoe={shoe}
                index={index}
                isFavorite={isInFavorites(shoe.title)}
                onFavoriteClick={onFavoriteClick}
                onCardClick={onCardClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Page Indicator */}
      {totalPages > 1 && (
        <div className="text-center mt-6 text-sm text-muted-foreground font-medium" aria-live="polite">
          Showing {currentPage * responsiveItemsPerPage + 1}-{Math.min((currentPage + 1) * responsiveItemsPerPage, items.length)} of {items.length} recommendations
        </div>
      )}
    </div>
  );
};