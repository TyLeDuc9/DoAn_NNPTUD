import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_BOOK_DETAIL } from "../config/api";
export const updateBookDetail = async (id, data) => {
    try {
        const res = await axios.put(
            `${API_BOOK_DETAIL}/${id}`,
            data,
            { headers: getAuthHeader() }
        );
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Lỗi khi cập nhật sách");
    }
};

export const getBookDetailById = async (id) => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}/${id}`)
        return res.data
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
        throw error;
    }

}
export const deleteBookDetail = async (id) => {
    try {
        const res = await axios.delete(`${API_BOOK_DETAIL}/${id}`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi xóa chi tiết sách:", error);
        throw error;
    }
};
export const createBookDetails = async (formData) => {
    try {
        const res = await axios.post(API_BOOK_DETAIL, formData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi tạo chi tiết sách:", error);
        throw error;
    }
};
export const searchBooks = async ({ q, page = 1, limit = 20, sort = "newest" }) => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}/search`, {
            params: { q, page, limit, sort },
        });
        return res.data;
    } catch (err) {
        console.error(" Lỗi gọi searchBooks:", err);
        throw err;
    }
};
export const getBooksByCategory = async (id, slug, page = 1, limit = 20, sort = "newest", priceRange = "all") => {
    try {
        const response = await axios.get(`${API_BOOK_DETAIL}/all/${id}/${slug}`, {
            params: { page, limit, sort, priceRange }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi gọi API:", error);
        throw error;
    }
};
export const getRelatedBook = async (id, slug) => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}/related/${id}/${slug}`)
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi khi gọi API getRelatedBook:", error);
        throw error;
    }
}
export const getAllBookByPublisher = async (id, slug, page = 1, limit = 20, sort = "newest", priceRange = "all") => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}/publisher/${id}/${slug}`, {
            params: { page, limit, sort, priceRange }
        });
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi khi gọi API getBookDetail:", error);
        throw error;
    }
};
export const getAllBook = async (page = 1, limit = 20, sort = "newest", priceRange = "all") => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}`, {
            params: { page, limit, sort, priceRange },
        });
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi khi gọi API getAllBook:", error);
        throw error;
    }
};
export const getBookDetail = async (id, slug) => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}/${id}/${slug}`);
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi khi gọi API getBookDetail:", error);
        throw error;
    }
};
export const getLatestBook = async () => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}/latest`)
        return res.data
    } catch (err) {
        console.log(err);
    }
}
export const getCategoryBook = async (id, slug) => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}/category/${id}/${slug}`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const getRandomBook = async () => {
    try {
        const res = await axios.get(`${API_BOOK_DETAIL}/random`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};