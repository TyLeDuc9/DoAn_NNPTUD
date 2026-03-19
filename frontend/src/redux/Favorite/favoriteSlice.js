import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favorites: [],   // danh sách sản phẩm yêu thích
    loading: false,  // trạng thái đang tải
    error: null,     // lỗi (nếu có)
  },
  reducers: {
    fetchFavoriteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFavoriteSuccess: (state, action) => {
      state.loading = false;
      state.favorites = action.payload;
    },
    fetchFavoriteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addFavorite: (state, action) => {
      // Kiểm tra nếu đã có trong danh sách thì không thêm trùng
      const exists = state.favorites.some(
        (item) =>
          (item.bookDetailId._id || item.bookDetailId) ===
          (action.payload.bookDetailId._id || action.payload.bookDetailId)
      );
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      // Xóa theo ID (hỗ trợ cả object hoặc string)
      state.favorites = state.favorites.filter(
        (item) =>
          (item.bookDetailId._id || item.bookDetailId) !== action.payload
      );
    },
  },
});

export const {
  fetchFavoriteStart,
  fetchFavoriteSuccess,
  fetchFavoriteFailure,
  addFavorite,
  removeFavorite,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
