
import { useEffect, useState } from "react";
import { getOrdersByUser } from "../services/orderApi";
import { useSelector } from "react-redux";

export const useMyOrderList = (page = 1, limit = 20) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = useSelector((state) => state.auth.login?.currentUser);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?._id) return;
      try {
        setLoading(true);
        const res = await getOrdersByUser({ userId: currentUser._id, page, limit });
        setOrders(res.orders || []);
      } catch (err) {
        setError(err.message || "Lỗi khi tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, page, limit]); 

  return { orders, loading, error };
};
