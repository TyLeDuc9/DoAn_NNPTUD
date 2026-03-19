import {
  fetchFavoriteStart,
  fetchFavoriteSuccess,
  fetchFavoriteFailure,
  addFavorite,
  removeFavorite,
} from "./favoriteSlice";
import axios from "axios";
import { API_FAVORITE } from "../../config/api";

// 📘 Lấy danh sách yêu thích theo user
export const fetchFavoritesByUser = (userId) => async (dispatch) => {
  dispatch(fetchFavoriteStart());
  try {
    const res = await axios.get(`${API_FAVORITE}/${userId}`);
    dispatch(fetchFavoriteSuccess(res.data));
  } catch (err) {
    dispatch(fetchFavoriteFailure(err.message));
  }
};

// ❤️ Thêm sản phẩm vào yêu thích
export const addToFavorite = (userId, bookDetail) => async (dispatch) => {
  try {
    const res = await axios.post(API_FAVORITE, {
      userId,
      bookDetailId: bookDetail._id,
    });
    dispatch(addFavorite(res.data.favorite));
  } catch (err) {
    dispatch(fetchFavoriteFailure(err.message));
  }
};

// 💔 Xóa sản phẩm khỏi yêu thích
export const removeFromFavorite = (userId, bookDetailId) => async (dispatch) => {
  try {
    await axios.delete(API_FAVORITE, {
      data: { userId, bookDetailId },
    });
    dispatch(removeFavorite(bookDetailId));
  } catch (err) {
    dispatch(fetchFavoriteFailure(err.message));
  }
};

// 🔍 Kiểm tra sản phẩm đã được yêu thích chưa
export const checkIsFavorite = async (userId, bookDetailId) => {
  try {
    const res = await axios.get(`${API_FAVORITE}/check`, {
      params: { userId, bookDetailId },
    });
    return res.data.isFavorite; // true/false
  } catch (err) {
    console.error("❌ Lỗi checkIsFavorite:", err);
    return false;
  }
};
