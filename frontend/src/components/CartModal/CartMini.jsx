import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { removeCartItem, fetchCart } from "../../redux/Cart/apiCart";
import { Link, useNavigate } from 'react-router-dom';

export const CartMini = ({ onClose }) => {
  const { cart } = useSelector((state) => state.cart);

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchCart(dispatch);
    }
  }, [dispatch, currentUser]);

  const hasItems = cart?.items && cart.items.length > 0;

  const handleRemove = (item) => {
    if (!cart?._id || !(item?._id || item?.id)) return;
    removeCartItem(dispatch, {
      cartId: cart._id,
      itemId: item._id || item.id,
    });
  };

  if (!currentUser) {
    return (
      <div className="absolute -top-2 right-6 w-80 bg-white border rounded shadow-lg p-2 z-50 flex flex-col items-center justify-center py-6 text-gray-500 text-sm">
        <span>Bạn cần đăng nhập để thêm sản phẩm giỏ hàng</span>
        <button
          onClick={() => navigate("/tai-khoan/dang-nhap")}
          className="mt-2 px-3 py-1 bg-[#386572] text-white text-sm rounded cursor-pointer"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="absolute lg:-top-2 lg:right-6 lg:w-80 w-60 -right-8 bg-white border rounded shadow-lg p-2 z-50">
      {!hasItems ? (
        <div className="flex flex-col items-center justify-center py-6 text-gray-500 text-sm">
          <span>Giỏ hàng trống</span>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="bg-[#386572] flex justify-between lg:p-2 p-1 rounded-sm">
            <span className="text-xs uppercase font-normal lg:font-semibold text-white">
              Giỏ hàng của tôi ({cart.totalQuantity} sản phẩm)
            </span>
            <AiOutlineClose
              className="w-4 font-bold h-4 text-white lg:mt-0 mt-0.5 cursor-pointer"
              onClick={onClose}
            />
          </div>

          {/* Items */}
          <div className="max-h-60 overflow-y-auto">
            {cart.items.map((item, index) => (
              <ul key={index} className="flex items-center gap-2 py-2 border-b">
                <Link to={`/san-pham/${item.bookId}/${item.slug}?volume=${item.volume || ''}`}>
                  <div className="w-24 h-24 flex items-center justify-center rounded overflow-hidden bg-white p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </Link>
                <li className="flex flex-col flex-1">
                  <Link
                    to={`/san-pham/${item.bookId}/${item.slug}?volume=${item.volume || ''}`}
                    className="lg:font-semibold font-normal lg:text-sm text-xs text-gray-700 cursor-pointer"
                  >
                    {item.name}
                  </Link>
                  <span className="text-xs text-gray-700">
                    Số lượng: {item.quantity}
                  </span>
                  {item.volume && (
                    <span className="text-xs text-gray-700">Tập {item.volume}</span>
                  )}
                  <span className="text-gray-700 text-xs">
                    Giá/sp: {item.price.toLocaleString()} ₫
                  </span>
                </li>
                <li onClick={() => handleRemove(item)}>
                  <AiOutlineClose
                    className="w-4 font-bold h-4 text-[#386572] cursor-pointer"

                  />
                </li>
              </ul>
            ))}
          </div>

          {/* Footer */}
          <hr className="bg-gray-300 h-0.5" />
          <div className="font-semibold lg:text-sm text-xs my-1 text-gray-700">
            Tạm tính:{" "}
            <span className="text-[#386572]">
              {cart?.totalPrice?.toLocaleString()} ₫
            </span>
          </div>
          <div className="flex justify-between mt-1 gap-2">
            <Link
              to="/gio-hang"
              className="w-1/2 border border-[#386572] text-[#386572] font-semibold lg:text-sm text-xs 
              rounded p-1 flex items-center justify-center"
            >
              Xem giỏ hàng
            </Link>
            <button
              onClick={() => navigate('/checkout-step-one')}
              className="w-1/2 border bg-[#386572] text-white font-semibold lg:text-sm text-xs  
              rounded p-1 flex items-center justify-center cursor-pointer"
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
