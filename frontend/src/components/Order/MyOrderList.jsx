import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { useMyOrderList } from "../../hooks/useMyOrderList";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { updateOrderStatus } from '../../services/orderApi';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const MyOrderList = () => {
    const { setComponentsLoading } = useLoading();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || 1);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const { orders, loading, error } = useMyOrderList(currentPage, 20, setTotal);
    const statusColors = {
        pending: "text-yellow-400",
        confirmed: "text-blue-400",
        completed: "text-green-400",
        cancelled: "text-red-400",
    };
    useEffect(() => {
        setComponentsLoading(loading);
    }, [loading]);
    useEffect(() => {
        setSearchParams({ page: currentPage });
    }, [currentPage]);

    const handleOrderDetail = (id) => navigate(`/orders/${id}`);

    const handleCancelOrder = async (orderId) => {
        try {
            await updateOrderStatus(orderId, "cancelled");
            toast.success("Hủy đơn thành công!");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error(err);
            toast.error("Hủy đơn thất bại!");
        }
    };

    const tdClass = "border border-gray-600"
    const thClass = "border border-gray-200 p-2";
    
    if (loading) return <ComponentLoading />;
    if (error) return <p className="text-center text-red-500 py-6">{error}</p>;
    if (!orders || orders.length === 0) return <p className="text-center py-6">Bạn chưa có đơn hàng nào.</p>;

    return (
        <div className="w-full lg:w-[85%] mx-auto lg:py-10 py-4">
            <Title title="Lịch sử đơn hàng" className="lg:text-lg text-base mb-6" />

            {/* ======================== DESKTOP TABLE ======================== */}
            <div className="border border-gray-400 rounded-sm overflow-hidden hidden lg:block">
                <table className="w-full border-collapse">
                    <thead className="bg-[#386572] text-white text-center text-base">
                        <tr>
                            <th className={thClass}>STT</th>
                            <th className={thClass}>Mã đơn hàng</th>
                            <th className={thClass}>Ngày tạo</th>
                            <th className={thClass}>Thanh toán</th>
                            <th className={thClass}>Phương thức</th>
                            <th className={thClass}>Trạng thái</th>
                            <th className={thClass}>Tổng</th>
                            <th className={thClass}>Hủy</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order, index) => {
                            const canCancel = order.status === "pending";

                            return (
                                <tr key={order._id} className="text-center bg-white">

                                    <td className={tdClass}>{index + 1}</td>

                                    <td
                                        onClick={() => handleOrderDetail(order._id)}
                                        className={`${tdClass} text-red-500 cursor-pointer hover:text-red-400`}
                                    >
                                        {order._id}
                                    </td>

                                    <td className={tdClass}>
                                        {new Date(order.createdAt).toLocaleString("vi-VN", {
                                            hour12: false,
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </td>

                                    <td className={tdClass}>{order.paymentStatus}</td>
                                    <td className={tdClass}>{order.paymentMethod || "Không xác định"}</td>
                                    <td className={`${tdClass} ${statusColors[order.status] || ""} font-[400px]`}>
                                        {order.status}
                                    </td>
                                    <td className={`${tdClass} px-1`}>{order.totalAmount?.toLocaleString("vi-VN")}₫</td>

                                    <td className={tdClass}>
                                        <button
                                            onClick={() => handleCancelOrder(order._id)}
                                            disabled={!canCancel}
                                            className={`px-1 py-1 text-sm m-2 cursor-pointer rounded text-white ${canCancel
                                                ? "bg-red-500 hover:bg-red-600"
                                                : "bg-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            Hủy đơn
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ======================== MOBILE CARD LIST ======================== */}
            <div className="lg:hidden flex flex-col gap-4">
                {orders.map((order) => {
                    const canCancel = order.status === "pending";

                    return (
                        <div
                            key={order._id}
                            className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm"
                        >
                            <div className="text-sm text-gray-700">
                                <p className="font-semibold">Mã đơn:
                                    <span
                                        onClick={() => handleOrderDetail(order._id)}
                                        className="text-red-500 ml-1 underline cursor-pointer"
                                    >
                                        {order._id}
                                    </span>
                                </p>

                                <p>Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                                <p>Thanh toán: {order.paymentStatus}</p>
                                <p>Phương thức: {order.paymentMethod}</p>
                                <p> Trạng thái: <span className={`${statusColors[order.status]}`}>{order.status}</span></p>

                                <p className="font-bold mt-2">
                                    Tổng: {order.totalAmount?.toLocaleString("vi-VN")}₫
                                </p>
                            </div>

                            <button
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={!canCancel}
                                className={`mt-3 w-full px-3 py-2 text-sm rounded text-white ${canCancel
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                Hủy đơn
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ======================== PAGINATION ======================== */}
            <div className="py-8 flex justify-center">
                <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={20}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};
