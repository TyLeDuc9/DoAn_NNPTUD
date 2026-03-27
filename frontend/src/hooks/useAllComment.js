import { useEffect, useState } from "react";
import { getAllComments } from "../services/commentApi";
export const useAllComment = (page = 1, limit = 20, sort = "newest") => {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        setLoading(true);
        const data = await getAllComments(page, limit, sort);
        setComments(data.data || []); // ✅ sửa ở đây
        setPagination(data.pagination || {});
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComment();
  }, [page, limit, sort]);

  return {
    comments, loading, error, pagination
  };
};
