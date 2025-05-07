"use client";

import { db } from './config';
import { collectionGroup, query, orderBy, where, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * Fetches the items based off the search and stores them in ascending order by price.
 * @param {string} search The search term to find the item(s).
 * @returns {Promise<Array|null>} Array of items matching the search term or null if not found.
 */
export const getItemsOnSearch = async(search, products) => {
    try{
        const itemsRef = collectionGroup(db, 'items');
        const q = query(itemsRef, orderBy('price', 'asc'));
        const querySnapshot = await getDocs(q);

        let items = [];
        querySnapshot.forEach(doc => {
            items.push({id: doc.id, ...doc.data()});
        });
        if(search && search.trim() !== ""){
            search = search.toLowerCase();
            items = items.filter(item => item.name && item.name.toLowerCase().includes(search));
        }
        return items;
    }
    catch{
        console.log("unable to fetch items");
        return null;
    }
}
/**
 * Fetches the items and stores them in ascending order by price.
 * @returns {Promise<Array|null>} Array of items or null if no items.
 */
export const getAllItems = async() => {
    try{
        const itemsRef = collectionGroup(db, 'items');
        const q = query(itemsRef);
        const querySnapshot = await getDocs(q, orderBy('price', 'asc'));

        let items = []
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const storeID = doc.ref.parent.parent.id;
            const zipcode = doc.ref.parent.parent.parent.parent.id;
            items.push({id: doc.id, store: storeID, zipcode: zipcode, ...data});
        });
        return items;
    } catch(error) {
        console.log("unable to fetch items", error);
        return null;
    }
}


