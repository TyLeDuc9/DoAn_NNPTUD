import { createSlice } from "@reduxjs/toolkit";

const ratingSlice = createSlice({
  name: "rating",
  initialState: {
    ratings: [],  // danh sách rating theo book hoặc user
    loading: false,
    error: null,
    success: false, // để UI hiển thị thông báo khi tạo/sửa/xóa
  },
  reducers: {
    fetchRatingStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    fetchRatingSuccess: (state, action) => {
      state.loading = false;
      state.ratings = action.payload;
    },
    fetchRatingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addOrUpdateRating: (state, action) => {
      state.loading = false;
      state.success = true;
      const { bookId, rating } = action.payload;

      // Nếu rating = 0 => xóa khỏi state
      if (rating === 0) {
        state.ratings = state.ratings.filter(
          (item) => (item.bookId._id || item.bookId) !== (bookId._id || bookId)
        );
        return;
      }

      const existing = state.ratings.find(
        (item) => (item.bookId._id || item.bookId) === (bookId._id || bookId)
      );

      if (existing) {
        existing.rating = rating;
      } else {
        state.ratings.push(action.payload);
      }
    },

    removeRating: (state, action) => {
      const bookId = action.payload;
      state.ratings = state.ratings.filter(
        (item) => (item.bookId._id || item.bookId) !== (bookId._id || bookId)
      );
    },
  },
});

export const {
  fetchRatingStart,
  fetchRatingSuccess,
  fetchRatingFailure,
  addOrUpdateRating,
  removeRating,
} = ratingSlice.actions;

export default ratingSlice.reducer;
