'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../libs/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

/**
 * StoreLocations component displays store locations for a selected zipcode
 * @param {Object} props - Component props
 * @param {string} props.selectedZipcode - The selected zipcode to display store locations for
 * @param {Function} props.onError - Callback function for error handling
 * @returns {JSX.Element} - The rendered component
 */
export default function StoreLocations({ selectedZipcode, onError }) {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Use useEffect to mark when component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch data on the client side
    if (!mounted || !selectedZipcode) return;

    const fetchStoreLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (onError) onError(null); // Clear any previous errors
        
        const zipcodeRef = doc(db, 'zipcode', selectedZipcode);
        const zipcodeDoc = await getDoc(zipcodeRef);

        if (zipcodeDoc.exists()) {
          setStoreData(zipcodeDoc.data().stores);
        } else {
          const errorMsg = `No store data found for zipcode ${selectedZipcode}`;
          setError(errorMsg);
          if (onError) onError(errorMsg);
        }
      } catch (err) {
        console.error("Error fetching store locations:", err);
        const errorMsg = "Failed to load store locations. Please check your Firebase configuration and permissions.";
        setError(errorMsg);
        if (onError) onError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreLocations();
  }, [selectedZipcode, mounted, onError]);

  // Return a simple placeholder during server-side rendering
  if (!mounted) {
    return <div className="p-4 text-center">Loading store locations...</div>;
  }

  if (!selectedZipcode) {
    return <div className="p-4 text-center">Please select a zipcode to view store locations</div>;
  }

  if (loading) {
    return <div className="p-4 text-center">Loading store locations...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!storeData) {
    return <div className="p-4 text-center">No store data available for this zipcode</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Store Locations for {selectedZipcode}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(storeData).map(([storeName, location]) => (
          <div key={storeName} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold capitalize">{storeName}</h3>
            <p>Latitude: {location.lat}</p>
            <p>Longitude: {location.lng}</p>
            <a 
              href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              View on Google Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 