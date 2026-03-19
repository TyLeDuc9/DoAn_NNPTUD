import { useState, useEffect } from "react";
import { getBooksByCategory } from "../services/bookDetailApi";

export const useAllBookCategory = (id, slug, page = 1, limit = 20, sort = "newest", priceRange = "all") => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !slug) return;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await getBooksByCategory(id, slug, page, limit, sort, priceRange);
        setBooks(data.books || []);
        setCategory(data.category || null);
        setPagination(data.pagination || {});
      } catch (err) {
        setError(err.message || "Lỗi khi tải sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [id, slug, page, limit, sort, priceRange]);

  return { books, category, pagination, loading, error };
};
