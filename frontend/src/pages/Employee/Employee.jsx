import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from "../../redux/Auth/authSlice";
import { IoNotifications, IoMailUnread } from "react-icons/io5";
import { Title } from '../../components/Title/Title';
import {
    FaUsers, FaUserCog, FaListAlt, FaBookOpen, FaComment,
    FaLayerGroup, FaBuilding, FaFileAlt, FaUser, FaAd, FaSignOutAlt, FaFeatherAlt, FaHeart, FaStar,
    FaMapMarkerAlt, FaShoppingCart, FaBox
} from "react-icons/fa";

export const Employee = () => {
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login-employee");
    };
    const adminMenu = [
        { name: "Profile", path: "/employee/profile", icon: <FaUserCog /> },
        { name: "User", path: "/employee/user", icon: <FaUsers /> },
        { name: "Order", path: "/employee/order", icon: <FaBox /> },
        { name: "Cart", path: "/employee/cart", icon: < FaShoppingCart /> },
        { name: "Shipping-Address", path: "/employee/shipping-address", icon: <FaMapMarkerAlt /> },
        { name: "Category", path: "/employee/category", icon: <FaListAlt /> },
        { name: "Book", path: "/employee/book", icon: <FaBookOpen /> },
        { name: "Book-Detail", path: "/employee/book-detail", icon: <FaLayerGroup /> },
        { name: "Author", path: "/employee/author", icon: <FaFeatherAlt /> },
        { name: "Publisher", path: "/employee/publisher", icon: <FaBuilding /> },
        { name: "Blog", path: "/employee/blog", icon: <FaFileAlt /> },
        { name: "Banner", path: "/employee/banner", icon: <FaAd /> },
        { name: "Favorite", path: "/employee/favorite", icon: <FaHeart /> },
        { name: "Rating", path: "/employee/rating", icon: <FaStar /> },
        { name: "Comment", path: "/employee/comment", icon: <FaComment /> },
    ];

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <div className="w-[15%] bg-[#386572] text-white flex flex-col fixed h-full p-4 overflow-y-auto">
                <Link to='/'>
                    <Title className="text-2xl font-semibold mb-6" title="BookNest" />
                </Link>
                <p className="text-lg font-semibold mb-4 pl-2">MENU</p>

                <div className="flex flex-col space-y-2">
                    {adminMenu.map(menu => (
                        <Link
                            to={menu.path}
                            key={menu.path}
                            className={`flex items-center gap-3 p-3 rounded-md transition-all ${pathname === menu.path
                                ? 'bg-[#639eae] text-white'
                                : 'hover:bg-[#4f7f8c]'
                                }`}
                        >
                            <span className="text-xl">{menu.icon}</span>
                            <span>{menu.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="ml-[15%] w-[85%] bg-gray-100 min-h-screen overflow-y-auto">
                {/* Header */}
                <div className="bg-white shadow-sm flex justify-between items-center py-4 px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4 text-[#639eae]">
                        <IoNotifications size={22} className="cursor-pointer hover:text-[#4f7f8c]" />
                        <IoMailUnread size={22} className="cursor-pointer hover:text-[#4f7f8c]" />
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 bg-[#639eae] text-white px-3 py-1.5 rounded-md">
                            <FaUser />
                            <span className="text-sm">{currentUser?.name || "Admin"}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-[#639eae] hover:text-[#4f7f8c] transition"
                        >
                            <FaSignOutAlt />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-2 py-12">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
