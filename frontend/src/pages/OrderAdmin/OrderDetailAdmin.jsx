import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderById, updateOrderStatus } from '../../services/orderApi'
import { Title } from "../../components/Title/Title";
import { Modal } from "antd";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const OrderDetailAdmin = () => {
  const { orderId } = useParams()
  const { setComponentsLoading } = useLoading();
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);
  const statusColors = {
    pending: "text-yellow-400",
    paid: "text-green-400",
    failed: "text-red-400",
  };

  // ==================== FETCH ORDER ====================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await getOrderById(orderId)
        setOrder(data.order)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])


  // ==================== UPDATE STATUS ====================
  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      const data = await getOrderById(orderId);
      setOrder(data.order);

      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };


  if (loading) return <ComponentLoading />;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error.message}</div>

  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";

  return (
    <div className="px-4 bg-white">
      <Title title={`Chi tiết đơn hàng: ${orderId}`} className="text-center text-3xl py-8 font-bold text-[#3a606e]" />

      {/* Thông tin khách hàng */}
      <div className="p-6 border-b-2 border-[#639eae]">
        <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
        <p><span className="font-medium">Email:</span> {order.userId.email}</p>
        <p><span className="font-medium">Phone:</span> {order.userId.phone}</p>
      </div>

      {/* Địa chỉ giao hàng */}
      {order.shippingAddress ? (
        <div className="border-[#639eae] p-6 border-b-2">
          <h3 className="text-xl font-semibold mb-4">Địa chỉ giao hàng</h3>
          <p><span className="font-medium">Họ và tên:</span> {order.shippingAddress.fullName}</p>
          <p><span className="font-medium">Phone:</span> {order.shippingAddress.phone}</p>
          <p><span className="font-medium">Địa chỉ:</span>
            {order.shippingAddress.address}, {order.shippingAddress.ward},
            {order.shippingAddress.district}, {order.shippingAddress.city}
          </p>
        </div>
      ) : (
        <div className="border-[#639eae] p-6 border-b-2 text-gray-500">
          Người dùng chưa có địa chỉ giao hàng.
        </div>
      )}

      {/* Thông tin thanh toán */}
      <div className="p-6 border-b-2 border-[#639eae]">
        <h3 className="text-xl font-semibold mb-4">Thanh toán</h3>
        <p><span className="font-medium">Phương thức:</span> {order.paymentMethod}</p>
        <p className="font-medium">Trạng thái:<span className={`${statusColors[order.paymentStatus]}`}> {order.paymentStatus}</span> </p>
        <p><span className="font-medium">Tổng số lượng:</span> {order.totalQuantity}</p>
        <p><span className="font-medium">Tổng tiền hàng:</span> {order.totalPrice.toLocaleString()} VNĐ</p>
        <p><span className="font-medium">Phí vận chuyển:</span> {order.shippingFee.toLocaleString()} VNĐ</p>
        <p className="font-bold"><span className="font-medium">Tổng thanh toán:</span> {order.totalAmount.toLocaleString()} VNĐ</p>

        <p>
          <span className="font-medium">Trạng thái đơn hàng:</span>{" "}
          <button className={`px-3 py-2 rounded text-white
            ${order.status === 'pending' ? 'bg-yellow-400 ' :
              order.status === 'confirmed' ? 'bg-blue-400 ' :
                order.status === 'completed' ? 'bg-green-400' :
                  'bg-red-400'
            }`}
          >
            {order.status}
          </button>
        </p>
      </div>


      {/* ==================== CẬP NHẬT TRẠNG THÁI ==================== */}
      <div className="p-6 border-b-2 border-[#639eae]">
        <h3 className="text-xl font-semibold mb-4">Cập nhật trạng thái đơn hàng</h3>

        <div className="flex gap-3">

          {/* Confirm */}
          <button
            onClick={() => handleUpdateStatus("confirmed")}
            disabled={order.status !== "pending"}
            className={`px-4 py-2 rounded text-white cursor-pointer
              ${order.status === "pending" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}
            `}
          >
            Xác nhận (Confirm)
          </button>

          {/* Complete */}
          <button
            onClick={() => handleUpdateStatus("completed")}
            disabled={order.status !== "confirmed"}
            className={`px-4 py-2 rounded text-white cursor-pointer
              ${order.status === "confirmed" ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}
            `}
          >
            Hoàn thành (Complete)
          </button>

          {/* Cancel */}
          <button
            onClick={() => handleUpdateStatus("cancelled")}
            disabled={order.status === "completed" || order.status === "cancelled"}
            className={`px-4 py-2 rounded text-white cursor-pointer
    ${order.status === "completed" || order.status === "cancelled" ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }
  `}
          >
            Hủy đơn (Cancel)
          </button>


        </div>
      </div>


      {/* Danh sách sản phẩm */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Sản phẩm trong đơn</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="border-collapse w-full">
            <thead className="bg-[#386572] text-white text-center">
              <tr>
                <th className={thClass}>Tên sách</th>
                <th className={thClass}>Hình ảnh</th>
                <th className={thClass}>Số lượng</th>
                <th className={thClass}>Tập</th>
                <th className={thClass}>Bìa</th>
                <th className={thClass}>Giá</th>
                <th className={thClass}>Thành tiền</th>
              </tr>
            </thead>

            <tbody>
              {order.orderDetails.map((item) => (
                <tr key={item._id} className="text-center transition">
                  <td className={tdClass}>{item.bookdetail_id?.book_id?.name || "Chưa có tên sách"}</td>
                  <td className={tdClass}>
                    <img
                      src={item.bookdetail_id.images[0]}
                      alt={item.bookdetail_id.book_id?.name}
                      onClick={() => setPreviewImage(item.bookdetail_id.images[0])}
                      className="h-28 w-20 mx-auto object-cover cursor-pointer"
                    />
                  </td>
                  <td className={tdClass}>{item.quantity}</td>
                  <td className={tdClass}>{item.bookdetail_id?.volume || 'x'}</td>
                  <td className={tdClass}>{item.bookdetail_id?.cover_type || "Chưa có"}</td>
                  <td className={tdClass}>{item.price.toLocaleString()} VNĐ</td>
                  <td className={tdClass}>{item.subtotal.toLocaleString()} VNĐ</td>
                </tr>
              ))}

              {/* Hàng tổng tiền */}
              <tr className="bg-gray-100 font-bold ">
                <td className={`${tdClass} pl-14`} colSpan={6}>Tổng thanh toán</td>
                <td className={`${tdClass} text-center`}>{order.totalAmount.toLocaleString()} VNĐ</td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

      {/* Preview Hình ảnh */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
      >
        <img src={previewImage} alt="preview" className="w-full h-full rounded" />
      </Modal>

    </div>
  )
}
