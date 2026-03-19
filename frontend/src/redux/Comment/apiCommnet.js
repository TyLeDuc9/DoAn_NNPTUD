import axios from "axios";
import {
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  updateCommentSuccess,
  deleteCommentSuccess,
} from "./commentSlice";
import { API_COMMENT } from "../../config/api";


// 🔑 Hàm tiện ích lấy header có token

const getAuthConfig = () => {
  const token = localStorage.getItem("token"); // ✅ Đúng key
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};


// 📌 Lấy danh sách comment theo bookId
export const fetchCommentsByBook = (bookId) => async (dispatch) => {
  dispatch(fetchCommentsStart());
  try {
    const res = await axios.get(`${API_COMMENT}/book/${bookId}`);
    dispatch(fetchCommentsSuccess(res.data));
  } catch (err) {
    console.error("❌ Lỗi lấy comment:", err);
    dispatch(fetchCommentsFailure(err.response?.data || err.message));
  }
};

// 📌 Thêm bình luận mới (cần token)
export const createComment = (commentData) => async (dispatch) => {
  dispatch(addCommentStart());
  try {
    const res = await axios.post(API_COMMENT, commentData, getAuthConfig());
    dispatch(addCommentSuccess(res.data.comment));
  } catch (err) {
    console.error("❌ Lỗi thêm comment:", err);
    dispatch(addCommentFailure(err.response?.data || err.message));
  }
};

// 📌 Cập nhật bình luận (chỉ chủ sở hữu)
// export const updateComment = (commentId, newDescription) => async (dispatch) => {
//   try {
//     const res = await axios.put(
//       `${API_COMMENT}/${commentId}`,
//       { description: newDescription },
//       getAuthConfig()
//     );
//     dispatch(updateCommentSuccess(res.data.comment));
//   } catch (err) {
//     console.error("❌ Lỗi cập nhật comment:", err);
//   }
// };
export const updateComment = (commentId, data) => async (dispatch) => {
  try {
    const res = await axios.put(
      `${API_COMMENT}/${commentId}`,
      data, // data = { description, isAnonymous }
      getAuthConfig()
    );
    dispatch(updateCommentSuccess(res.data.comment));
  } catch (err) {
    console.error("❌ Lỗi cập nhật comment:", err);
  }
};

// 📌 Xóa bình luận (chỉ chủ sở hữu)
export const deleteComment = (commentId) => async (dispatch) => {
  try {
    await axios.delete(`${API_COMMENT}/${commentId}`, getAuthConfig());
    dispatch(deleteCommentSuccess(commentId));
  } catch (err) {
    console.error("❌ Lỗi xóa comment:", err);
  }
};
