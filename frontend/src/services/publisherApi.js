import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_PUBLISHER} from "../config/api";

export const updatePublisher = async (id, data) => {
  try {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.address) formData.append("address", data.address);
    if (data.phone) formData.append("phone", data.phone);
    if (data.email) formData.append("email", data.email);
    if (data.image) formData.append("image", data.image);

    const res = await axios.put(`${API_PUBLISHER}/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi cập nhật publisher!");
  }
};

export const getAllPublisher = async (page = 1, limit = 20, search = "", sort = "newest") => {
  try {
    const res = await axios.get(`${API_PUBLISHER}/all`, {
      params: { page, limit, search, sort },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Không thể tải danh sách NXB!");
  }
};


export const getPublisherById = async (id) => {
  try {
    const res = await axios.get(`${API_PUBLISHER}/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Không thể tải thông tin NXB!");
  }
};


export const createPublisher = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    if (data.image) formData.append("image", data.image);

    const res = await axios.post(API_PUBLISHER, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    if (err.response?.data?.message?.includes("Email")) {
      throw new Error("Email này đã tồn tại!");
    }
    throw new Error(err.response?.data?.message || "Lỗi tạo publisher!");
  }
};



export const deletePublisher = async (id) => {
  try {
    const res = await axios.delete(`${API_PUBLISHER}/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi xóa publisher!");
  }
};
