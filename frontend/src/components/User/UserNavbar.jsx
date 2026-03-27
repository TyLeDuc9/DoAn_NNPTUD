import React from "react";
import { FaUser, FaShoppingBag, FaHeart, FaKey, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/Auth/authSlice"; 
import { clearCartOnLogout } from "../../redux/Cart/cartSlice";
import { Title } from "../../components/Title/Title";
export const UserNavbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartOnLogout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menu = [
    { name: "Thông tin cá nhân", key: "info", icon: <FaUser /> },
    { name: "Đơn hàng của tôi", key: "orders", icon: <FaShoppingBag /> },
    { name: "Đổi mật khẩu", key: "password", icon: <FaKey /> },
    { name: "Đăng xuất", key: "logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="bg-white lg:rounded-2xl rounded-sm shadow-md p-4">
      <Title title={currentUser?.name} className="lg:text-2xl text-lg text-[#3a606e] text-center font-medium py-2" />
      <h3 className="lg:text-lg text-sm font-semibold mb-4 border-b pb-2">Tài khoản</h3>
      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.key}>
            <button
              onClick={() =>
                item.key === "logout" ? handleLogout() : setActiveTab(item.key)
              }
              className={`flex lg:flex-row flex-col items-center lg:text-base text-sm cursor-pointer 
                lg:gap-3 w-full text-left px-3 py-2 rounded-lg transition duration-300
                ${activeTab === item.key
                  ? "bg-[#3a606e] text-white"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
