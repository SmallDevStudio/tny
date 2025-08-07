import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slices/languageSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";

const loadCartFromLocalStorage = () => {
  try {
    if (typeof window === "undefined") return undefined; // ✅ ป้องกัน SSR error

    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) return undefined;
    return { cart: JSON.parse(serializedCart) };
  } catch (e) {
    console.warn("Failed to load cart from localStorage", e);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    language: languageReducer,
    cart: cartReducer,
    user: userReducer,
  },
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("cart", JSON.stringify(state.cart));
  });
}

export default store;
