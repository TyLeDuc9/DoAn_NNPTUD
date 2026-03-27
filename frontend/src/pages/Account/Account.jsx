import React, { useState } from "react";
import banner2 from "../../assets/banner/banner2.jpg";
import { Link } from "react-router-dom";
import { UserNavbar } from "../../components/User/UserNavbar";
import { FormUserInformation } from "../../components/Form/FormUserInformation";
import { FormChangePass } from "../../components/Form/FormChangePass";
import { MyOrderList } from "../../components/Order/MyOrderList";

export const Account = () => {
  const [activeTab, setActiveTab] = useState("info");

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return <FormUserInformation />;
      case "password":
        return <FormChangePass />;
      case "orders":
        return <MyOrderList />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="relative">
        <img src={banner2} className="lg:w-full lg:h-[50vh] w-full sm:h-[25vh] h-[20vh] object-cover" alt="Banner" />
        <span className="absolute inset-0 flex text-[#3a606e] items-center justify-center 
        lg:text-2xl text-sm italic font-medium uppercase">
          <Link to="/" className="hover:text-[#5a899a] text-[#3a606e]">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          Tài khoản
        </span>
      </div>

      {/* Nội dung chính */}
      <div className="w-[85%] mx-auto lg:py-10 py-4 grid lg:grid-cols-12 grid-cols-1 lg:gap-6">
        {/* Cột trái: menu người dùng */}
        <div className="col-span-3">
          <UserNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Cột phải: nội dung động */}
        <div className="col-span-9 bg-white shadow-md rounded-2xl p-6 mt-4 lg:mt-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
