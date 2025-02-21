import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slices/languageSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
    cart: cartReducer,
    user: userReducer,
  },
});
