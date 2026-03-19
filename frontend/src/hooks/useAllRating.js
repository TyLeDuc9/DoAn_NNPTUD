import { useEffect, useState } from "react";
import { getAllRating } from "../services/ratingApi";

export const useAllRating = (page = 1, limit = 20, sort = "newest") => {
  const [ratings, setRatings] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const data = await getAllRating({ page, limit, sort });
        setRatings(data.data || []);
        setPagination(data.pagination || {});
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [page, limit, sort]);

  return { ratings, pagination, loading };
};
