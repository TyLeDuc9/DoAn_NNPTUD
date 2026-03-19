import { useState, useEffect } from "react";
import { getAllAuthor } from "../services/authorApi";

export const useAllAuthor = (
  page = 1,
  limit = 20,
  search = "",
  sort = "newest"
) => {
  const [authors, setAuthors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await getAllAuthor({ page, limit, search, sort });
      setAuthors(res.authors || []);
      setPagination(res.pagination || {});
    } catch (err) {
      setError(err.message || "Lỗi lấy dữ liệu tác giả");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const res = await getAllAuthor({ page, limit, search, sort });
        setAuthors(res.authors || []);
        setPagination(res.pagination || {});
      } catch (err) {
        setError(err.message || "Lỗi lấy dữ liệu tác giả");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors()
  }, [page, limit, search, sort]);

  return {
    authors,
    pagination,
    loading,
    error,
    fetchAuthors
  };
};
