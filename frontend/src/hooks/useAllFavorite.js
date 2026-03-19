import { useEffect, useState } from "react";
import { getAllFavorite } from "../services/favoriteApi"; 

export const useAllFavorite = (page = 1, limit = 20, sort = "newest") => {
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await getAllFavorite({ page, limit, sort });
        setFavorites(res.data || []);
        setPagination(res.pagination || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [page, limit, sort]); // chạy lại khi các tham số thay đổi

  return { favorites, pagination, loading, error };
};
