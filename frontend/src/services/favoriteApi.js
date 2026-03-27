import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_FAVORITE } from "../config/api";

export const deleteFavoriteBook = async (id) => {
  try {
    const res = await axios.delete(`${API_FAVORITE}/${id}`,{
      headers: getAuthHeader(),
    })
    return res.data

  } catch (err) {
    console.error("❌ Lỗi khi gọi API getAllFavorite:", err);
    throw new Error(err.response?.data?.message);
  }
}
export const getAllFavorite = async ({
  page = 1,
  limit = 20,
  sort = "newest", // newest | oldest
} = {}) => {
  try {
    const res = await axios.get(`${API_FAVORITE}/all`, {
      headers: getAuthHeader(), // nếu cần token
      params: { page, limit, sort },
    });

    return res.data; // trả về { pagination, data }
  } catch (err) {
    console.error("❌ Lỗi khi gọi API getAllFavorite:", err);
    throw new Error(err.response?.data?.message || "Lỗi khi lấy danh sách yêu thích");
  }
};
