
import { useEffect, useState } from "react";
import { getAllBook } from "../services/bookDetailApi";

export const useAllBook = (page = 1, limit = 20, sort = "newest", priceRange = "all") => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getAllBook(page, limit, sort, priceRange);
        setBooks(data.books || []);
        setPagination(data.pagination || {});
      } catch (err) { 
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, limit, sort, priceRange]); 

  return { books, loading, error, pagination };
};
