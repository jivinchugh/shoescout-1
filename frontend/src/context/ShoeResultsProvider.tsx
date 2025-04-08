import React, { createContext, useContext, useState } from 'react';

interface ShoeData {
  title: string;
  description: string;
  retail_price: string | number;
  market_price: string | number;
  buy_now_price: string | number;
  user_size: number;
  brand: string;
  image_url: string;
  id?: string;
}

interface ShoeResultsContextType {
  results: ShoeData[];
  setResults: React.Dispatch<React.SetStateAction<ShoeData[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ShoeResultsContext = createContext<ShoeResultsContextType>({
  results: [],
  setResults: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
});

export const ShoeResultsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [results, setResults] = useState<ShoeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <ShoeResultsContext.Provider value={{
      results,
      setResults,
      isLoading,
      setIsLoading,
      error,
      setError
    }}>
      {children}
    </ShoeResultsContext.Provider>
  );
};

export const useShoeResults = () => useContext(ShoeResultsContext);