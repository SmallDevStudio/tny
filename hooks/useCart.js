import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

export default function useCart(callback) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCartItems = async (userId) => {
    setError(null);
    setLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, "carts", userId, "items"),
      (snapshot) => {
        let items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCart(items);
        callback(items);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  const addItemToCart = async (userId, item) => {
    try {
      await addDoc(collection(db, "carts", userId, "items"), item);
    } catch (e) {
      console.error("Error adding item to cart: ", e);
    }
  };

  const updateCartItem = async (userId, itemId, data) => {
    try {
      const itemRef = doc(db, "carts", userId, "items", itemId);
      await updateDoc(itemRef, data);
    } catch (e) {
      console.error("Error updating cart item: ", e);
    }
  };

  const removeItemFromCart = async (userId, itemId) => {
    try {
      await deleteDoc(doc(db, "carts", userId, "items", itemId));
    } catch (e) {
      console.error("Error removing item from cart: ", e);
    }
  };

  return {
    cart,
    loading,
    error,
    getCartItems,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
  };
}
