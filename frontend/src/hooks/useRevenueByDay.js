import { useState, useEffect } from "react";
import { getRevenue } from "../services/orderApi";

export const useRevenueByDay = ({ type = "day", page = 1, limit = 20, sort = "newest" }) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const res = await getRevenue({ type, page, limit, sort });
        setData(res.data);
        setPagination(res.pagination);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [type, page, limit, sort]);

  return { data, pagination, loading, error };
};
