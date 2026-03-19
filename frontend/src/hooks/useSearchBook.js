import { useState, useEffect } from "react";
import { searchBooks } from "../services/bookDetailApi";
export const useSearchBook = (query, page = 1, limit = 20, sort = "newest") => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return; 

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await searchBooks({ q: query, page, limit, sort });

        setBooks(data.books);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, page, limit, sort]);

  return { books, pagination, loading, error };
};
