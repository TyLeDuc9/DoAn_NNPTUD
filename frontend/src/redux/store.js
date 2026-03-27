import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Cart/cartSlice";
import authReducer from './Auth/authSlice'
import favoriteReducer from './Favorite/favoriteSlice'
import ratingReducer from "./Rating/ratingSlice";
import commentReducer from "./Comment/commentSlice";
import shippingAddressReducer from './ShippingAddress/shippingAddressSlice'
const persistedUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;
export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    favorite: favoriteReducer,
    rating: ratingReducer,
    comment: commentReducer,
    shippingAddress:shippingAddressReducer
  },
  preloadedState: {
    auth: {
      login: {
        currentUser: persistedUser,
        isFetching: false,
        error: false
      },
      register: {
        success: false,
        isFetching: false,
        error: false
      }
    }
  }
});
