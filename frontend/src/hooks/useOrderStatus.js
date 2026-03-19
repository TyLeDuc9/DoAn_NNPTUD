import { useState, useEffect } from "react";
import { getOrdersByStatus } from "../services/orderApi";

export const useOrderStatus = (status, page = 1, limit = 20, sort = "newest") => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await getOrdersByStatus({ status, page, limit, sort });
                if (isMounted) {
                    setOrders(data.orders);
                    setPagination(data.pagination);
                    setError(null);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) setError(err.message || "Lỗi khi lấy đơn hàng");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchOrders();
        return () => { isMounted = false; };
    }, [status, page, limit, sort]);

    return { orders, pagination, loading, error };
};
