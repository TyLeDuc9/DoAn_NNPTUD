import React, { useEffect } from "react";
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeCartItem, updateCartItem } from "../../redux/Cart/apiCart";
import { Link, useNavigate } from 'react-router-dom';

export const CartModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && user) {
      fetchCart(dispatch);
    }
  }, [isOpen, dispatch, user]);

  if (!isOpen) return null;

  const handleRemove = (item) => {
    if (!item?.id) return;
    removeCartItem(dispatch, { itemId: item.id });
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(dispatch, { itemId: item.id, quantity: newQuantity });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white lg:rounded-2xl rounded-lg mb-36 lg:mb-0 sm:mb-72 shadow-2xl w-[85%] lg:max-w-[850px] mx-4 relative animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 lg:p-5 p-2 relative">
          <h2 className="text-sm md:text-lg font-bold text-[#639eae] uppercase tracking-wide">
            Giỏ hàng của bạn ({cart?.totalQuantity || 0} sản phẩm)
          </h2>
          <button
            onClick={onClose}
            className="bg-[#4f7f8d] rounded-full p-2 absolute -top-4 -right-4 shadow-md hover:scale-110 transition"
          >
            <AiOutlineClose className="w-4 h-4 md:w-5 md:h-5 text-white cursor-pointer" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="lg:px-4 md:px-6 p-2 lg:py-4">
          <div className="grid grid-cols-2 md:grid-cols-6 font-semibold text-gray-600
           border-b border-gray-200 pb-3 mb-3 lg:text-sm text-xs uppercase">
            <div className="col-span-1 md:col-span-2">Sản phẩm</div>
            <div className="hidden md:block">Đơn giá</div>
            <div>Số lượng</div>
            <div className="hidden md:block">Thành tiền</div>
            <div className="hidden md:block">Xóa</div>
          </div>

          <div className="max-h-[250px] overflow-y-auto custom-scroll">
            {cart?.items?.map((item, index) => (
              <div
                key={item.id || index}
                className="grid grid-cols-2 md:grid-cols-6 items-center border-b 
                border-gray-100 py-4 gap-2 md:gap-4 hover:bg-gray-50 transition"
              >
                {/* Hình & tên */}
                <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
                  <Link to={`/san-pham/${item.bookId}/${item.slug}?volume=${item.volume || ''}`}>
                    <div className="w-12 h-16 md:w-16 md:h-24 flex items-center justify-center overflow-hidden rounded-md">
                      <img
                        src={item.bookdetail_id?.images?.[0]}
                        alt={item.bookdetail_id?.book_id?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col text-xs md:text-base">
                    <Link
                      className="font-medium text-gray-800 hover:text-[#639eae] transition"
                      to={`/san-pham/${item.bookId}/${item.slug}?volume=${item.volume || ''}`}
                    >
                      {item.bookdetail_id?.book_id?.name}
                    </Link>
                    <div className="text-xs  md:text-sm text-gray-500">
                      Cover: {item.cover_type} {item.volume && <span> - Tập: {item.volume}</span>}
                    </div>
                  </div>
                </div>

                {/* Giá */}
                <div className="hidden md:block text-[#639eae] font-semibold">{item.price.toLocaleString()}đ</div>

                {/* Số lượng */}
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  max={item.stock}
                  onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                  className="lg:w-16 w-16 border border-gray-300 rounded-md 
                  text-center focus:ring-2 text-base focus:ring-[#639eae] focus:outline-none"
                />

                {/* Thành tiền */}
                <div className="hidden md:block text-[#639eae] font-semibold">{item.total.toLocaleString()}đ</div>

                {/* Xóa */}
                <button onClick={() => handleRemove(item)} className="hover:text-red-500 transition cursor-pointer">
                  <AiOutlineDelete className="w-5 h-5 text-red-400 md:w-6 md:h-6" />
                </button>
              </div>
            ))}
          </div>

          {/* Tổng */}
          <div className="flex flex-col md:flex-row justify-end items-end mt-5 text-sm lg:text-base gap-1 md:gap-3">
            <div className="md:mr-6">
              Tổng: <span className="text-[#639eae] font-bold">{cart?.totalPrice?.toLocaleString() || 0}đ</span>
            </div>
            <div className="">Số lượng sản phẩm: {cart?.totalQuantity || 0}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between lg:text-base text-sm items-center p-5 border-t border-gray-200 gap-3 md:gap-0">
          <button onClick={onClose} className="lg:px-5 lg:py-2 lg:bg-gray-200 
          rounded-md lg:hover:bg-gray-300 transition cursor-pointer">
            Tiếp tục mua hàng
          </button>
          <div className="flex flex-col md:flex-row gap-3">
            <button onClick={() => fetchCart(dispatch)} className="px-5 py-2
             bg-gray-300 rounded-md hover:bg-gray-400 hidden lg:block transition cursor-pointer">
              Cập nhật giỏ hàng
            </button>
            <button
              onClick={() => navigate('/checkout-step-one')}
              className="px-5 py-2 bg-gradient-to-r from-[#639eae] 
              to-[#4f7f8d] text-white rounded-md shadow hover:opacity-90 transition cursor-pointer"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
