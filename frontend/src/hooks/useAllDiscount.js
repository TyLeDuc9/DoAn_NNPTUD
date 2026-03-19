import React, { useEffect, useState } from 'react';
import { getAllDiscount } from '../services/discountApi';

export const useAllDiscount = () => {
  const [discount, setDiscount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        setLoading(true);
        const data = await getAllDiscount();
        setDiscount(data);
      } catch (err) {
        setError(err.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscount();
  }, []);

  return { discount, loading, error };
};
