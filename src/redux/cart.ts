import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, IProductData } from "../types";


interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setToCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = [...action.payload]
    },
    addToCart: (state, action: PayloadAction<{ data: IProductData, amount?: number }>) => {
      const existingItem = state.items.findIndex(item => item.id === action.payload.data.id);
      if (existingItem !== -1) {
        console.log("🚀 ~ existingItem:", existingItem)
        state.items[existingItem].quantity += 1;
      } else {
        state.items.push({ ...action.payload.data, quantity: action.payload.amount ?? 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
});

export const { addToCart, setToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
