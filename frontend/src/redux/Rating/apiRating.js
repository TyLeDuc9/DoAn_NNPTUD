import axios from "axios";
import {
  fetchRatingStart,
  fetchRatingSuccess,
  fetchRatingFailure,
  addOrUpdateRating,
  removeRating,
} from "./ratingSlice";
import { API_RATING } from "../../config/api";


// 🟢 Lấy tất cả rating theo book
export const fetchRatingsByBook = (bookId) => async (dispatch) => {
  dispatch(fetchRatingStart());
  try {
    const res = await axios.get(`${API_RATING}/book/${bookId}`);
    dispatch(fetchRatingSuccess(res.data));
  } catch (err) {
    dispatch(fetchRatingFailure(err.response?.data?.message || err.message));
  }
};

// 🟢 Lấy tất cả rating theo user
export const fetchRatingsByUser = (userId) => async (dispatch) => {
  dispatch(fetchRatingStart());
  try {
    const res = await axios.get(`${API_RATING}/user/${userId}`);
    dispatch(fetchRatingSuccess(res.data));
  } catch (err) {
    dispatch(fetchRatingFailure(err.response?.data?.message || err.message));
  }
};

// 🟢 Tạo hoặc xóa rating (click sao hiện tại để xóa)
export const createRating = (userId, bookId, rating) => async (dispatch) => {
  try {
    const res = await axios.post(API_RATING, { userId, bookId, rating });

    if (rating === 0 || res.data.message === "Đã xóa đánh giá.") {
      dispatch(removeRating(bookId));
    } else {
      dispatch(addOrUpdateRating(res.data));
    }
  } catch (err) {
    dispatch(fetchRatingFailure(err.response?.data?.message || err.message));
  }
};

// 🟢 Cập nhật rating
export const updateRating = (id, newRating) => async (dispatch) => {
  try {
    const res = await axios.put(`${API_RATING}/${id}`, { rating: newRating });
    dispatch(addOrUpdateRating(res.data));
  } catch (err) {
    dispatch(fetchRatingFailure(err.response?.data?.message || err.message));
  }
};

// 🟢 Xóa rating
export const deleteRating = (id, bookId) => async (dispatch) => {
  try {
    await axios.delete(`${API_RATING}/${id}`);
    dispatch(removeRating(bookId));
  } catch (err) {
    dispatch(fetchRatingFailure(err.response?.data?.message || err.message));
  }
};

// 🟢 Kiểm tra user đã rating chưa
export const checkUserRated = async (userId, bookId) => {
  try {
    const res = await axios.get(`${API_RATING}/check`, {
      params: { userId, bookId },
    });
    return res.data.isRated;
  } catch (err) {
    console.error("Lỗi checkUserRated:", err);
    return false;
  }
};
