import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CartCheckOut } from "../../components/CartModal/CartCheckOut";
import { useNavigate } from "react-router-dom";
import { createOrderFromCart } from "../../services/orderApi";
import momoLogo from "../../assets/paymentLogo/MoMo.png";
import codLogo from "../../assets/paymentLogo/Cod.jpg";
import vnpayLogo from "../../assets/paymentLogo/vnpay.jpg";
import { createVNPayPayment } from "../../services/paymentApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const CheckOutStepTwo = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const addresses = useSelector((state) => state.shippingAddress.addresses || []);
  const defaultAddress = addresses.find((addr) => addr.is_default);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);


  const canPlaceOrder = currentUser?._id && defaultAddress?._id;

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return;

    setLoading(true);
    try {

      const orderData = {
        userId: currentUser._id,
        shippingAddressId: defaultAddress._id,
        paymentMethod,
      };
      const res = await createOrderFromCart(orderData);
      const orderId = res.order._id;

      if (paymentMethod === "VNPay") {

        const paymentUrl = await createVNPayPayment(orderId);
        window.location.href = paymentUrl;
      } else if (paymentMethod === "Momo") {
        toast.info("Thanh toán Momo chưa tích hợp, tạm thanh toán COD");
        navigate(`/orders/${orderId}`);
      } else {
        // COD
        toast.success("Đặt hàng thành công!");
        setTimeout(() => navigate(`/orders/${orderId}`), 800);
      }
    } catch (err) {
      console.error("❌ Lỗi đặt hàng:", err);
      toast.error("Đặt hàng thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[85%] mx-auto mt-[8vh] bg-gray-50 rounded-xl shadow-xs">
      <div className="grid lg:grid-cols-12 grid-cols-1 min-h-screen ">
        {/* Cột trái - Checkout */}
        <div className="col-span-6 bg-white p-8 border-r border-gray-200">
          <h1 className="text-[#364e57] text-2xl font-medium">BookNest</h1>
          <h2 className="lg:text-lg text-base font-medium text-gray-500 lg:my-6 my-3">Địa chỉ giao hàng</h2>
          {defaultAddress && (
            <div className=" border-[#639eae] bg-[#eaf2f5] p-2 border rounded-lg my-4">
              <p className="text-sm lg:text-base font-semibold">{defaultAddress.fullName}</p>
              <p className="text-sm text-gray-600">{defaultAddress.phone}</p>
              <p className="text-sm text-gray-600 my-0.5">
                {defaultAddress.address}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.city}
              </p>
              <span className="text-xs bg-[#4c8696] text-white px-2 py-1 rounded-md mt-2 inline-block">Mặc định</span>
            </div>
          )}

          <div className="lg:mt-6 mt-2">
            <h2 className="lg:text-lg text-base font-medium text-gray-500 my-6">Chọn phương thức thanh toán</h2>
            <div className="">
              <label className="flex items-center gap-3 cursor-pointer border border-gray-200 
              lg:p-6 p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#4c8696] h-4 w-4"
                />
                <img src={codLogo} alt="COD" className="w-12 h-12 object-contain" />
                <span className="text-gray-700">Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer border border-gray-200 lg:p-6 p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Momo"
                  checked={paymentMethod === "Momo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#4c8696] h-4 w-4"
                />
                <img src={momoLogo} alt="Momo" className="w-12 h-12 object-contain" />
                <span className="text-gray-700">Thanh toán qua Momo</span>
              </label>

              <label className="flex items-center cursor-pointer gap-3 border border-gray-200 lg:p-6 p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VNPay"
                  checked={paymentMethod === "VNPay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#4c8696] h-4 w-4"
                />
                <img src={vnpayLogo} alt="VNPay" className="w-12 h-12 object-contain" />
                <span className="text-gray-700">Thanh toán qua VNPay</span>
              </label>
            </div>

          </div>
        </div>

        {/* Cột phải - Cart summary */}
        <div className="col-span-6 bg-gray-100 p-8 rounded-r-xl">
          <CartCheckOut />
          <div className="flex justify-end lg:mt-12 mt-6">
            <button
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder || loading}
              className={`bg-[#4c8696] text-white p-2 lg:text-base text-sm
                rounded-sm hover:bg-[#639eae] cursor-pointer ${(!canPlaceOrder || loading) ?
                  "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Đang đặt hàng..." : "Đặt hàng"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} toastStyle={{
        fontSize: window.innerWidth < 768 ? '12px' : '16px',
        minWidth: window.innerWidth < 768 ? '10px' : '50px',
      }} />
    </div>
  );
};

