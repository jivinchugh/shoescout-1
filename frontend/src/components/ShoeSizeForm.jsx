import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ShoeSizeForm = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [shoeSize, setShoeSize] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentShoeSize, setCurrentShoeSize] = useState(null);

  // When making fetch requests, ensure the URL is correctly formed
  const apiUrl = import.meta.env.VITE_API_URL.endsWith('/') 
    ? `${import.meta.env.VITE_API_URL}api/shoe-size`
    : `${import.meta.env.VITE_API_URL}/api/shoe-size`;

  // Fetch the user's current shoe size when component loads
  useEffect(() => {
    const fetchShoeSize = async () => {
      if (!isAuthenticated) return;
  
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setCurrentShoeSize(data.shoeSize);
        }
      } catch (error) {
        console.error("Error fetching shoe size:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchShoeSize();
  }, [isAuthenticated, getAccessTokenSilently, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!shoeSize) {
      setMessage("Please enter a shoe size");
      return;
    }
    
    const shoeSizeNum = parseFloat(shoeSize);
    if (isNaN(shoeSizeNum)) {
      setMessage("Shoe size must be a number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      
      const token = await getAccessTokenSilently();
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shoeSize: shoeSizeNum }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Shoe size saved successfully!");
        setCurrentShoeSize(shoeSizeNum);
        setShoeSize("");
      } else {
        setMessage(`Error: ${data.error || "Failed to save shoe size"}`);
      }
    } catch (error) {
      console.error("Error saving shoe size:", error);
      setMessage("An error occurred while saving your shoe size");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Your Shoe Size</h2>
      
      {currentShoeSize && (
        <p className="mb-4 text-gray-700">
          Your current shoe size: <span className="font-bold">{currentShoeSize}</span>
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="shoeSize" className="block text-gray-700 mb-2">
            {currentShoeSize ? "Update your shoe size:" : "Enter your shoe size:"}
          </label>
          <input
            id="shoeSize"
            type="text"
            value={shoeSize}
            onChange={(e) => setShoeSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 10.5"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Shoe Size"}
        </button>
        
        {message && (
          <p className={`mt-3 ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ShoeSizeForm;
