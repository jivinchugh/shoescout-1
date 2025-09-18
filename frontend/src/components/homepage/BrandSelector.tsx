import React, { useState } from 'react';
import { Button } from '../ui/button';

const BRANDS = [
  'Nike',
  'Adidas', 
  'Jordan',
  'New Balance',
  'Asics',
  'Balenciaga',
  'Gucci',
  'Louis Vuitton',
  'Crocs',
];

interface BrandSelectorProps {
  onSelect: (brands: string[]) => void;
  initialSelected?: string[];
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ onSelect, initialSelected = [] }) => {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const handleSelect = (brand: string) => {
    let newSelected: string[];
    if (selected.includes(brand)) {
      newSelected = selected.filter(b => b !== brand);
    } else if (selected.length < 3) {
      newSelected = [...selected, brand];
    } else {
      return; // Don't update if already at max
    }
    setSelected(newSelected);
    onSelect(newSelected); // Call onSelect directly instead of useEffect
  };

  // Update selected brands when initialSelected prop changes
  React.useEffect(() => {
    if (JSON.stringify(initialSelected) !== JSON.stringify(selected)) {
      setSelected(initialSelected);
      onSelect(initialSelected);
    }
  }, [initialSelected]); // Remove onSelect and selected from dependency array

  return (
    <div className="brand-selector">
      <h3 className="text-lg font-semibold mb-3">Select up to 3 brands:</h3>
      <div className="grid grid-cols-3 gap-2">
        {BRANDS.map(brand => (
          <Button
            key={brand}
            variant={selected.includes(brand) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSelect(brand)}
            disabled={!selected.includes(brand) && selected.length >= 3}
            className="text-xs"
          >
            {brand}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BrandSelector;
