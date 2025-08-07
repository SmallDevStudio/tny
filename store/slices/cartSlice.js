// /store/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState, // ✅ ใช้ object
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addToCart(state, action) {
      const existing = state.items.find(
        (item) => item.courseId === action.payload.courseId
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(
        (item) => item.courseId !== action.payload.courseId
      );
    },
    decreaseQuantity(state, action) {
      const item = state.items.find(
        (item) => item.courseId === action.payload.courseId
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.courseId !== action.payload.courseId
          );
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  clearCart,
  setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
