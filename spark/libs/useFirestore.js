"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './config';

/**
 * Custom hook for fetching a collection from Firestore
 * @param {string} collectionName - Name of the Firestore collection
 * @param {object} options - Query options (orderByField, orderDirection, whereField, whereOperator, whereValue)
 * @returns {object} - { data, loading, error }
 */
export const useCollection = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { 
    orderByField, 
    orderDirection = 'asc', 
    whereField, 
    whereOperator = '==', 
    whereValue 
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const collectionRef = collection(db, collectionName);
        
        // Build query with optional filters
        let queryRef = collectionRef;
        
        if (whereField && whereValue !== undefined) {
          queryRef = query(queryRef, where(whereField, whereOperator, whereValue));
        }
        
        if (orderByField) {
          queryRef = query(queryRef, orderBy(orderByField, orderDirection));
        }
        
        const querySnapshot = await getDocs(queryRef);
        
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setData(fetchedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching collection:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, whereField, whereOperator, whereValue, orderByField, orderDirection]);

  return { data, loading, error };
};

/**
 * Custom hook for fetching a single document from Firestore
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} docId - Document ID to fetch
 * @returns {object} - { data, loading, error }
 */
export const useDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!docId) {
        setData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          setData(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [collectionName, docId]);

  return { data, loading, error };
}; 