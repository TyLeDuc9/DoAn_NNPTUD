import { useEffect, useState } from "react";
import { getAllBook } from "../services/bookApi";

export const useAllBookAdmin = (page = 1, limit = 20, search = "", sort = "newest") => {
  const [book, setBook] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBook = async () => {
      try {
        setLoading(true);
        const data = await getAllBook({ page, limit, search, sort });
        setBook(data.books || []); 
        setPagination(data.pagination || {});
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBook();
  }, [page, limit, search, sort]);

  return { book, pagination, loading, error };
};
