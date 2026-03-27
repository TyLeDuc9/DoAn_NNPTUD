import { useEffect, useState } from "react";
import { getAllCart } from "../services/cartApi";

export const useAllCart = (page = 1, limit = 20, sort = "newest") => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        const res = await getAllCart({ page, limit, sort });
        setData(res.data);              
        setPagination(res.pagination);     
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, [page, limit, sort]);

  return { data, pagination, loading, error };
};
