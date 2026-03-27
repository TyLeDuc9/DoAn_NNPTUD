import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    // --- Lấy danh sách ---
    fetchCommentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess: (state, action) => {
      state.loading = false;
      state.comments = action.payload;
    },
    fetchCommentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Thêm mới ---
    addCommentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCommentSuccess: (state, action) => {
      state.loading = false;
      state.comments.unshift(action.payload); // thêm vào đầu danh sách
    },
    addCommentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Cập nhật ---
    updateCommentSuccess: (state, action) => {
      const updated = action.payload;
      state.comments = state.comments.map((c) =>
        c._id === updated._id ? updated : c
      );
    },

    // --- Xóa ---
    deleteCommentSuccess: (state, action) => {
      state.comments = state.comments.filter((c) => c._id !== action.payload);
    },
  },
});

export const {
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  updateCommentSuccess,
  deleteCommentSuccess,
} = commentSlice.actions;

export default commentSlice.reducer;
