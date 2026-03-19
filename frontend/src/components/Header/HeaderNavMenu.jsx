import React, { useState } from "react";
import {
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { GenreCategory } from "../Genre/GenreCategory";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/Auth/authSlice";
import { clearCartOnLogout } from "../../redux/Cart/cartSlice";
import { clearAddresses } from "../../redux/ShippingAddress/shippingAddressSlice";

export const HeaderNavMenu = ({ mobile = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  const [openDropdown, setOpenDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartOnLogout());
    dispatch(clearAddresses());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItems = [
    { name: "Giới thiệu", path: "/gioi-thieu" },
    { name: "Tất cả sách", path: "/tat-ca-sach" },
    { name: "Danh mục", dropdown: true },
    { name: "Nhà xuất bản", path: "/nha-xuat-ban" },
  ];

  return (
    <ul
      className={`w-full ${
        mobile ? "flex flex-col gap-4" : "flex items-center gap-4"
      }`}
    >
      {navItems.map((item, index) => (
        <li
          key={index}
          className={`relative ${
            mobile ? "" : "group"
          } lg:text-base text-sm font-semibold`}
        >
          {/* TEXT & CLICK HANDLER */}
          {item.dropdown ? (
            <p
              className="flex items-center gap-2 px-4 cursor-pointer hover:text-[#639eae]"
              onClick={() => mobile && setOpenDropdown(!openDropdown)}
            >
              {item.name}
              <FaChevronDown className="text-xs" />
            </p>
          ) : (
            <Link
              to={item.path}
              className="px-4 flex items-center hover:text-[#639eae]"
            >
              {item.name}
            </Link>
          )}

          {/* DESKTOP: hover để mở */}
          {!mobile && item.dropdown && (
            <div className="hidden group-hover:block absolute top-full left-0">
              <GenreCategory />
            </div>
          )}

          {/* MOBILE: click để mở */}
          {mobile && item.dropdown && openDropdown && (
            <div className="mt-2">
              <GenreCategory mobile />
            </div>
          )}
        </li>
      ))}

      {/* LOGIN / LOGOUT */}
      {!currentUser ? (
        <>
          <li className="lg:text-base text-sm font-semibold">
            <Link
              to="/tai-khoan/dang-nhap"
              className="flex items-center gap-2 px-4 hover:text-[#639eae]"
            >
              Đăng nhập <FaSignInAlt />
            </Link>
          </li>

          <li className="lg:text-base text-sm font-semibold">
            <Link
              to="/tai-khoan/dang-ky"
              className="flex items-center gap-2 px-4 hover:text-[#639eae]"
            >
              Đăng ký <FaUserPlus />
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className="lg:text-base text-sm font-semibold">
            <Link
              to="/tai-khoan"
              className="flex items-center lg:gap-2 gap-1 px-4 hover:text-[#639eae]"
            >
              <FaUser /> {currentUser?.name}
            </Link>
          </li>

          <li 
            className="px-4 flex items-center text-sm font-semibold lg:text-base gap-2 hover:text-[#639eae] cursor-pointer"
            onClick={handleLogout}
          >
            Đăng xuất <FaSignOutAlt />
          </li>
        </>
      )}
    </ul>
  );
};
