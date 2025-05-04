"use client";

/**
 * Utility function to parse coordinates and create Google Maps links
 * @param {any} coordinates - Coordinates in any format (string, GeoPoint, or object)
 * @returns {string} - Google Maps URL or # if parsing fails
 */
export function createMapLink(coordinates) {
  try {
    // If coordinates is undefined or null
    if (!coordinates) return "#";
    
    // Check if coordinates is a Firestore GeoPoint-like object
    if (typeof coordinates === 'object') {
      // Try different property name patterns that might exist in Firestore GeoPoint objects
      if (coordinates._lat !== undefined && coordinates._long !== undefined) {
        return `https://www.google.com/maps?q=${coordinates._lat},${coordinates._long}`;
      }
      
      if (coordinates.latitude !== undefined && coordinates.longitude !== undefined) {
        return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
      }
      
      if (coordinates.lat !== undefined && coordinates.lng !== undefined) {
        return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
      }
    }
    
    // Convert to string if it's not already a GeoPoint object
    const coordStr = String(coordinates).trim();
    
    console.log("Parsing string coordinates:", coordStr);
    
    // Try to extract numbers and directions from the string
    const numbers = coordStr.match(/[\d.]+/g);
    const directions = coordStr.match(/[NSEW]/g);
    
    // If we have the expected format with numbers and directions
    if (numbers && numbers.length >= 2 && directions && directions.length >= 2) {
      const lat = parseFloat(numbers[0]);
      const lng = parseFloat(numbers[1]);
      
      // Apply direction modifiers (S is negative lat, W is negative lng)
      const latitude = directions[0] === 'S' ? -lat : lat;
      const longitude = directions[1] === 'W' ? -lng : lng;
      
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }
    
    // Fallback to just using a link to Google Maps with no coordinates
    return "https://www.google.com/maps";
  } catch (error) {
    console.error("Error parsing coordinates:", error);
    return "#";
  }
}

/**
 * Format coordinates for display
 * @param {any} coordinates - Coordinates in any format
 * @returns {string} - Formatted string for display
 */
export function formatCoordinates(coordinates) {
  if (!coordinates) return "No coordinates available";
  
  try {
    // If it's a Firestore GeoPoint-like object
    if (typeof coordinates === 'object') {
      let lat, lng;
      
      // Try different property patterns
      if (coordinates._lat !== undefined && coordinates._long !== undefined) {
        lat = coordinates._lat;
        lng = coordinates._long;
      } else if (coordinates.latitude !== undefined && coordinates.longitude !== undefined) {
        lat = coordinates.latitude;
        lng = coordinates.longitude;
      } else if (coordinates.lat !== undefined && coordinates.lng !== undefined) {
        lat = coordinates.lat;
        lng = coordinates.lng;
      } else {
        // Can't determine the coordinates from the object
        return String(coordinates);
      }
      
      const latDir = lat >= 0 ? 'N' : 'S';
      const lngDir = lng >= 0 ? 'E' : 'W';
      return `[${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}]`;
    }
    
    // If it's already a string, return it
    return String(coordinates);
  } catch (error) {
    console.error("Error formatting coordinates:", error);
    return String(coordinates);
  }
} 