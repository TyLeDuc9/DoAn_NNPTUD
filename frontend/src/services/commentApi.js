import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_COMMENT } from "../config/api";
export const deleteCommnetBook = async (id) => {
    const res = await axios.delete(`${API_COMMENT}/${id}`, { headers: getAuthHeader(), })
    return res.data
}
export const getAllComments = async (page = 1, limit = 10, sort = "newest") => {
    const res = await axios.get(`${API_COMMENT}`, {
        headers: getAuthHeader(),
        params: { page, limit, sort },
    });
    return res.data;
};
