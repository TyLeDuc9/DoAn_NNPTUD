import { useEffect, useState } from "react";
import { getAllAddress } from "../services/shippingAddressApi";

export const useAllAddress = ({ page = 1, limit = 20, sort = "newest" } = {}) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAllAddress({ page, limit, sort });
        setAddresses(data.users || []);
        setPagination(data.pagination || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [page, limit, sort]);

  return { addresses, loading, error, pagination };
};
