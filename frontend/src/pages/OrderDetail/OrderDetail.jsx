import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Title } from "../../components/Title/Title";
import { useGetOrderDetail } from "../../hooks/useGetOrderDetail";
import { BannerPages } from '../../components/Banner/BannerPages'
export const OrderDetail = () => {
  const { orderId } = useParams();
  const { orderDetails, shippingFee, totalAmount, loading, error } = useGetOrderDetail(orderId);

  const addresses = useSelector((state) => state.shippingAddress.addresses || []);
  const defaultAddress = addresses.find((addr) => addr.is_default);
  if (loading) return <p className="text-center py-6">Đang tải chi tiết đơn hàng...</p>;
  if (error) return <p className="text-center text-red-500 py-6">{error}</p>;

  const createdAt = new Date(orderDetails[0].createdAt).toLocaleString("vi-VN", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <div>
      {/* Banner */}
      <BannerPages />

      {/* Nội dung */}
      <div className="w-[85%] mx-auto lg:py-10">
        <Title title="Chi tiết đơn hàng của bạn" className="lg:text-xl text-lg font-medium border-b border-gray-300 py-3" />
        <Link to="/tai-khoan" className="py-2 lg:text-base sm:text-base text-sm text-red-600 inline-block hover:text-red-500">
          ← Trở về tài khoản
        </Link>
        <h2 className="lg:text-xl text-lg font-medium">Đơn hàng: {orderId}</h2>
        <p className="my-2 lg:text-base text-sm">Ngày đặt: {createdAt}</p>
        <div className="hidden lg:grid lg:grid-cols-12 gap-4">
          {/* Bên trái */}
          <div className="lg:col-span-8">
            <div className="border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-[#386572] text-white text-center">
                  <tr>
                    <th className="border border-gray-200 p-2">STT</th>
                    <th className="border border-gray-200 p-2">Sản phẩm</th>
                    <th className="border border-gray-200 p-2">Hình ảnh</th>
                    <th className="border border-gray-200 p-2">Tập</th>
                    <th className="border border-gray-200 p-2">Bìa</th>
                    <th className="border border-gray-200 p-2">Số lượng</th>
                    <th className="border border-gray-200 p-2">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((item, index) => (
                    <tr key={item._id} className="text-center border border-gray-200">
                      <td className="border border-gray-200 p-2 ">{index + 1}</td>
                      <td className="border border-gray-200 p-2">{item.bookdetail_id.book_id.name}</td>
                      <td className="border border-gray-200 p-2">
                        <img
                          src={item.bookdetail_id.images[0]}
                          alt={item.bookdetail_id.book_id.name}
                          className="w-16 h-20 object-cover mx-auto"
                        />
                      </td>
                      <td className="border border-gray-200 p-2">{item.bookdetail_id.volume || "x"}</td>
                      <td className="border border-gray-200 p-2">{item.bookdetail_id.cover_type}</td>
                      <td className="border border-gray-200 p-2">{item.quantity}</td>
                      <td className="border border-gray-200 p-2 text-red-500 ">{item.price.toLocaleString("vi-VN")} ₫</td>
                    </tr>
                  ))}
                  <tr className="text-center">
                    <td className="border border-gray-200 p-2 text-left" colSpan={6}>
                      Phí vận chuyển (Miễn phí vận chuyển với đơn hàng từ 300.000 VND)
                    </td>
                    <td className="border border-gray-200 p-2 text-red-500">{shippingFee.toLocaleString("vi-VN")} ₫</td>
                  </tr>
                  <tr className="text-center">
                    <td className="border border-gray-200 p-2 text-left  font-semibold" colSpan={6}>Tổng tiền</td>
                    <td className="border border-gray-200 p-2 font-semibold text-red-500 ">{totalAmount.toLocaleString("vi-VN")} ₫</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
          {/* Bên phải */}
          <div className="lg:col-span-4 lg:mx-4 my-2 lg:my-0">
            <h2 className="lg:text-xl text-lg font-medium">Địa chỉ nhận hàng</h2>
            {defaultAddress && (
              <div className=" border-[#639eae] bg-[#eaf2f5] p-2 border rounded-sm lg:mt-4 my-4 lg:my-0">
                <p className="text-sm font-semibold">{defaultAddress.fullName}</p>
                <p className="text-sm text-gray-600">{defaultAddress.phone}</p>
                <p className="text-sm text-gray-600 my-0.5">
                  {defaultAddress.address}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.city}
                </p>
                <span className="text-xs bg-[#4c8696] text-white px-2 py-1 rounded-md mt-2 inline-block">Mặc định</span>
              </div>
            )}
          </div>
        </div>
        {/* Mobile view */}
        <div className="lg:hidden">
          {orderDetails.map((item) => (
            <div key={item._id} className="rounded-sm p-2 border-b-2 border-gray-100 ">
              <div className="flex gap-2">
                <div>
                  <img
                    src={item.bookdetail_id.images[0]}
                    alt={item.bookdetail_id.book_id.name}
                    className="w-16 h-24 object-cover mr-2"
                  />
                  <p className="text-sm sm:text-base ">Tập: {item.bookdetail_id.volume || "x"}</p>
                  <p className="text-sm sm:text-base ">{item.bookdetail_id.cover_type}</p>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium">{item.bookdetail_id.book_id.name}</p>
                  <p className="text-sm sm:text-base  my-1">Số lượng: {item.quantity}</p>
                  <p className="text-sm sm:text-base  text-red-500 font-semibold">{item.price.toLocaleString("vi-VN")} ₫</p>
                </div>

              </div>



            </div>
          ))}

          <div className="rounded-sm p-2 mb-4 flex justify-end gap-4">
            <div className="text-right">
              <p className="sm:text-base text-sm">Phí vận chuyển: <span  className="text-red-500 ml-2.5">{shippingFee.toLocaleString("vi-VN")} ₫</span></p>
              <p className="text-base sm:text-lg  font-semibold">Tổng tiền: <span className="text-red-500">{totalAmount.toLocaleString("vi-VN")} ₫</span></p>
            </div>
          </div>

          {/* Địa chỉ */}
          {defaultAddress && (
            <div className="border-[#639eae] bg-[#eaf2f5] p-2 border rounded-sm mb-4">
              <p className="sm:text-base text-sm font-semibold">{defaultAddress.fullName}</p>
              <p className="sm:text-base text-sm text-gray-600">{defaultAddress.phone}</p>
              <p className="sm:text-base text-sm text-gray-600">
                {defaultAddress.address}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.city}
              </p>
              <span className="text-xs bg-[#4c8696] text-white px-2 py-1 rounded-md mt-2 inline-block">Mặc định</span>
            </div>
          )}
        </div>






      </div>
    </div>
  );
};
