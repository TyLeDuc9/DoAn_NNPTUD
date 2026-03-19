import { createSlice } from "@reduxjs/toolkit";

// Load cart từ localStorage, nếu không có trả về giá trị mặc định
const loadCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart
      ? JSON.parse(cart)
      : { items: [], totalQuantity: 0, totalPrice: 0 };
  } catch (err) {
    console.error("Lỗi load cart từ localStorage", err);
    return { items: [], totalQuantity: 0, totalPrice: 0 };
  }
};

// Lưu cart vào localStorage
const saveCart = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    console.error("Không thể lưu cart vào localStorage", err);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCart(),
    loading: false,
    error: null,
  },
  reducers: {
    fetchCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action) => {
      state.cart = action.payload || { items: [], totalQuantity: 0, totalPrice: 0 };
      state.loading = false;
      saveCart(state.cart);
    },
    fetchCartFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addItemSuccess: (state, action) => {
      state.cart = action.payload;
      saveCart(state.cart);
    },
    updateItemSuccess: (state, action) => {
      state.cart = action.payload;
      saveCart(state.cart);
    },
    removeItemSuccess: (state, action) => {
      state.cart = action.payload;
      saveCart(state.cart);
    },
    clearCartSuccess: (state) => {
      state.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
      saveCart(state.cart);
    },
    clearCartOnLogout: (state) => {
      state.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
      saveCart(state.cart);
    },
  },
});

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailed,
  addItemSuccess,
  updateItemSuccess,
  removeItemSuccess,
  clearCartSuccess,
  clearCartOnLogout,
} = cartSlice.actions;

export default cartSlice.reducer;
