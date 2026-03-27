import React, { useEffect } from 'react';
import banner2 from "../../assets/banner/banner2.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";
import { Title } from "../../components/Title/Title";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem } from "../../redux/Cart/apiCart";
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";

export const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const { setComponentsLoading } = useLoading();

  // Cập nhật số lượng
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(dispatch, { itemId: item.id, quantity: newQuantity });
  };

  // Xóa sản phẩm
  const handleRemove = (item) => {
    if (!cart?._id || !(item?._id || item?.id)) return;
    removeCartItem(dispatch, {
      cartId: cart._id,
      itemId: item._id || item.id,
    });
  };

  const handleCheckOut = () => {
    if (!cart?.items?.length) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán!");
      return;
    }
    navigate("/checkout-step-one");
  };

  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);

  if (loading) return <ComponentLoading />;

  return (
    <section>
      {/* Banner */}
      <div className="relative">
        <img
          src={banner2}
          className="lg:w-full lg:h-[50vh] w-full sm:h-[25vh] h-[20vh] object-cover"
          alt="banner"
        />
        <div className="absolute inset-0 flex text-[#3a606e] items-center justify-center lg:text-xl text-sm italic font-medium">
          <Link to="/">Trang chủ/</Link>
          <span className="ml-2">Giỏ hàng của bạn - BOOKNEST</span>
        </div>
      </div>

      {/* Giỏ hàng */}
      <div className="bg-white w-[85%] mx-auto lg:my-16 my-4">
        <Title
          title="Giỏ hàng của bạn"
          className="text-gray-800 uppercase lg:text-xl text-sm font-bold mb-6 border-b border-gray-300 pb-2"
        />

        {/* Header cột – chỉ hiện trên laptop */}
        <div className="hidden lg:grid grid-cols-6 font-semibold text-gray-700 border-y
         border-gray-300 py-3 px-4 rounded-t-md text-center">
          <div className="col-span-2">Sản phẩm</div>
          <div>Đơn giá</div>
          <div>Số lượng</div>
          <div>Thành tiền</div>
          <div>Xóa</div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-200">
          {cart?.items?.map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="py-4 px-4 border-b border-gray-200"
            >
              {/* Laptop layout */}
              <div className="hidden lg:grid lg:grid-cols-6 items-center gap-6">

                {/* Ảnh + tên */}
                <div className="col-span-2 flex items-center gap-4">
                  <Link to={`/san-pham/${item.bookId}/${item.slug}?volume=${item.volume || ''}`}>
                    <img
                      src={item.image || '/images/default.jpg'}
                      className="w-16 h-24 object-cover"
                      alt={item.name}
                    />
                  </Link>
                  <div>
                    <Link className="font-medium text-base">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-500">
                      Cover: {item.cover_type}
                      {item.volume && <span className="px-2">Tập: {item.volume}</span>}
                    </div>
                  </div>
                </div>

                {/* Đơn giá */}
                <div className="text-center font-semibold text-gray-700 text-lg">
                  {(item.price || 0).toLocaleString()}đ
                </div>

                {/* Số lượng */}
                <div className="flex justify-center">
                  <input
                    type="number"
                    min={1}
                    max={item.stock || 100}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                    className="w-16 h-8 border border-gray-300 rounded-md text-center"
                  />
                </div>

                {/* Thành tiền */}
                <div className="text-center font-bold text-gray-700 text-lg">
                  {(item.total || 0).toLocaleString()}đ
                </div>

                {/* Xóa */}
                <div className="flex justify-center">
                  <button onClick={() => handleRemove(item)}>
                    <AiOutlineClose className="w-5 h-5 text-gray-500 hover:text-[#4f7f8d]" />
                  </button>
                </div>
              </div>

              {/* Mobile layout */}
              <div className="lg:hidden flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    className="w-16 h-24 object-cover"
                    alt={item.name}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Cover: {item.cover_type}
                      {item.volume && <span className="px-2">Tập: {item.volume}</span>}
                    </p>
                  </div>
                  <button onClick={() => handleRemove(item)}>
                    <AiOutlineClose className="w-4 h-4 text-gray-500 hover:text-[#4f7f8d]" />
                  </button>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Đơn giá:</span>
                  <span className="font-semibold">{item.price.toLocaleString()}đ</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Số lượng:</span>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                    className="w-14 border border-gray-300 rounded-md text-center"
                  />
                </div>

                <div className="hidden lg:flex justify-between text-sm">
                  <span className="text-gray-700">Thành tiền:</span>
                  <span className="font-bold text-gray-900">
                    {item.total.toLocaleString()}đ
                  </span>
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Tổng tiền */}
        <div className="flex justify-end flex-col items-end mt-4">
          <span className="text-gray-700  lg:text-sm text-sm">
            Số lượng sản phẩm: {cart?.totalQuantity || 0}
          </span>

          <div className="py-2">
            Tổng:{' '}
            <span className="text-gray-700 font-bold lg:text-2xl text-lg">
              {cart?.totalPrice?.toLocaleString()}đ
            </span>
          </div>

          <div className="flex gap-2 text-white">
            <button
              className="lg:px-4 lg:py-2 px-2 py-1.5 bg-[#364e57] lg:text-base text-sm rounded hover:bg-[#4f7f8d]"
              onClick={() => fetchCart(dispatch)}
            >
              Cập nhật
            </button>

            <button
              onClick={handleCheckOut}
              className="lg:px-4 lg:py-2 px-2 py-1.5 bg-[#364e57] lg:text-base text-sm rounded hover:bg-[#4f7f8d]"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
