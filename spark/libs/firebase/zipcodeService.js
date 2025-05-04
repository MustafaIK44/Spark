"use client";

import { db } from './config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * Fetches all zipcodes from the Firestore 'zipcode' collection
 * @returns {Promise<Array>} - Array of zipcode strings
 */
export const fetchZipcodes = async () => {
  try {
    const zipcodeCollectionRef = collection(db, 'zipcodes');
    console.log("got zipcodes collection");
    const querySnapshot = await getDocs(zipcodeCollectionRef);
    
    const zipcodes = [];
    querySnapshot.forEach((doc) => {
      // If the document ID is the zipcode, add it directly
      zipcodes.push(doc.id);
    });
    console.log("zipcodes found: ", zipcodes);
    return zipcodes;
  } catch (error) {
    console.error('Error fetching zipcodes:', error);
    return [];
  }
};

/**
 * Fetches store data for a specific zipcode
 * @param {string} zipcode - The zipcode to fetch data for
 * @returns {Promise<Object|null>} - Store location data or null if not found
 */
export const fetchZipcodeData = async (zipcode) => {
  try {
    const zipcodeDocRef = doc(db, 'zipcode', zipcode);
    const docSnap = await getDocs(zipcodeDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log(`No data found for zipcode: ${zipcode}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching data for zipcode ${zipcode}:`, error);
    return null;
  }
}; 