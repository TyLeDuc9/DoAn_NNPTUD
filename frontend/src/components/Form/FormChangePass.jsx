import React, { useState } from "react";
import { Title } from "../Title/Title";
import { changePassword } from "../../redux/Auth/authApi";
export const FormChangePass = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Vui lòng đăng nhập lại!");
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(token, formData);
      setMessage(result.message);
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <Title title="Đổi mật khẩu" className="lg:text-lg text-sm mb-6" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 relative">
          <label className="lg:w-1/4 w-full text-[#3a606e] font-medium text-sm lg:text-base">
            Mật khẩu hiện tại
          </label>

          <div className="relative lg:w-3/4 w-full">
            <input
              type="password"
              name="oldPassword"
              placeholder="Mật khẩu hiện tại"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none 
                 focus:ring-2 focus:ring-[#3a606e] text-base lg:text-base"
            />


          </div>
        </div>


        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          <label className="lg:w-1/4 w-full text-[#3a606e] font-medium text-sm lg:text-base">
            Mật khẩu mới
          </label>

          <div className="relative lg:w-3/4 w-full">
            <input
              type="password"
              name="newPassword"
              placeholder="Mật khẩu mới"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 pr-10 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-[#3a606e] 
                 text-base sm:text-base lg:text-base"
            />


          </div>
        </div>


        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          <label className="lg:w-1/4 w-full text-[#3a606e] font-medium text-sm lg:text-base">
            Xác nhận mật khẩu mới
          </label>

          <div className="relative lg:w-3/4 w-full">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 pr-10 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-[#3a606e] 
                 text-base sm:text-base lg:text-base"
            />


          </div>
        </div>


        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#3a606e] text-white lg:text-base sm:text-base text-sm lg:px-6 px-4 py-2 rounded-lg hover:bg-[#2b4a57] ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-[#3a606e]">{message}</p>
      )}
    </div>
  );
};
