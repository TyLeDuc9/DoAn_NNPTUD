import axios from "axios";
import { getAuthHeader } from "../utils/authHeader"; 
import { API_PAYMENT } from "../config/api";

/**
 * Tạo payment VNPay
 * @param {string} orderId - ID của order
 * @returns {string} paymentUrl - URL redirect sang VNPay
 */
export const createVNPayPayment = async (orderId) => {
  try {
    const res = await axios.post(
      `${API_PAYMENT}/create-vnpay`,
      { orderId },
      { headers: getAuthHeader() } // nếu cần token
    );
    return res.data.paymentUrl; // trả về URL VNPay
  } catch (error) {
    console.error("❌ Lỗi tạo VNPay payment:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Xử lý VNPay return (thường redirect về frontend, không cần gọi trực tiếp)
 * @param {object} queryParams - query string từ VNPay
 * @returns {object} kết quả payment
 */
export const handleVNPayReturn = async (queryParams) => {
  try {
    const res = await axios.get(`${API_PAYMENT}/vnpay-return`, {
      params: queryParams,
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi xử lý VNPay return:", error.response?.data || error.message);
    throw error;
  }
};
