import { useEffect, useState } from "react";
import { getBookDetail } from "../services/bookDetailApi"; 

export const useBookDetail = (id, slug) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !slug) return;

    const fetchBookDetail = async () => {
      try {
        const data = await getBookDetail(id, slug);
        setBook(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id, slug]);

  return { book, loading, error };
};
