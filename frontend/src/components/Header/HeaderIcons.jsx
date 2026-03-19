import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { CartMini } from "../CartModal/CartMini";
import { fetchCart } from "../../redux/Cart/apiCart";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const HeaderIcons = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart); // { items, totalQuantity, totalPrice }
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // Số lượng sản phẩm, mặc định 0 nếu cart chưa load
  const totalQuantity = cart?.totalQuantity ?? 0;
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  // Load cart khi user login
  useEffect(() => {
    const loadCart = async () => {
      if (user && user._id) {
        await fetchCart(dispatch);
      }
    };
    loadCart();
  }, [dispatch, user]);

  // Click ngoài đóng cart
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleFavoriteClick = () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để xem danh sách yêu thích!");
      return;
    }
    navigate("/yeu-thich");
  };
  return (
    <div className="flex text-xl relative items-center">
      {/* Cart */}
      <div className="relative" ref={cartRef}>
        <FaShoppingCart
          className="lg:mx-6 lg:text-xl sm:text-xl text-lg cursor-pointer"
          onClick={() => setIsCartOpen(!isCartOpen)}
        />
        {/* Badge luôn hiển thị, kể cả 0 */}
        <span
          className='absolute lg:left-10 left-3 -top-2 lg:-top-3 text-xs font-semibold bg-[#639eae]
            text-white lg:w-5 w-4 h-4 lg:h-5 flex items-center justify-center rounded-full'
        >
          {totalQuantity}
        </span>

        {/* CartMini */}
        {isCartOpen && (
          <div className="absolute right-0 mt-2 z-50">
            <CartMini className onClose={() => setIsCartOpen(false)} />
          </div>
        )}
      </div>

      {/* Wishlist */}
      <FaHeart className="cursor-pointer text-lg lg:text-xl sm:text-xl lg:ml-6 sm:ml-6 ml-4" onClick={handleFavoriteClick} />
      <ToastContainer position="top-right" autoClose={3000} toastStyle={{
        fontSize: window.innerWidth < 768 ? '12px' : '16px',
        minWidth: window.innerWidth < 768 ? '10px' : '50px',
      }} />
    </div>
  );
};
