import { useState, useEffect } from "react";
import { getOrderDetails } from "../services/orderApi"; 

export const useGetOrderDetail = (orderId) => {
  const [orderDetails, setOrderDetails] = useState([]); 
  const [shippingFee, setShippingFee] = useState(0); 
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderDetails({ orderId });
        setOrderDetails(data.orderDetails || []);
        setShippingFee(data.shippingFee || 0);
        setTotalAmount(data.totalAmount || 0);
        setError(null);
      } catch (err) {
        setError(err.message || "Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { orderDetails, shippingFee, totalAmount, loading, error };
};
