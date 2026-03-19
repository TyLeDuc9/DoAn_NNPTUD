import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Title } from "../Title/Title";
import { updateUser } from "../../redux/Auth/authApi";

export const FormUserInformation = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth.login);
  const token = localStorage.getItem("token");
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    birthday: "",
  });

  // ✅ Cập nhật formData mỗi khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        gender: currentUser?.gender || "",
        birthday: currentUser?.birthday
          ? currentUser.birthday.split("T")[0]
          : "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = currentUser?._id || currentUser?.id;

    if (!userId) return setMsg("Không tìm thấy thông tin người dùng!");
    if (!token) return setMsg("Vui lòng đăng nhập lại để cập nhật thông tin!");

    updateUser(userId, formData, dispatch, token, setMsg);
  };

  return (
    <div className="">
      <Title title="Thông tin cá nhân" className="lg:text-lg text-sm mb-6" />

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Họ tên */}
        <div className="flex items-center justify-between">
          <label className="w-1/4 text-[#3a606e] font-medium lg:text-base text-sm">Họ và tên</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg text-base
              focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
          />
        </div>

        {/* Email */}
        <div className="flex items-center justify-between lg:text-base text-sm">
          <label className="w-1/4 text-[#3a606e] font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled // ✅ không cho sửa email đăng nhập
            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
              bg-gray-100 cursor-not-allowed text-base"
          />
        </div>

        {/* Số điện thoại */}
        <div className="flex items-center justify-between">
          <label className="w-1/4 text-[#3a606e] font-medium lg:text-base text-sm">Số điện thoại</label>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-[#3a606e] text-base"
          />
        </div>

        {/* Giới tính */}
        <div className="flex items-center justify-between">
          <label className="w-1/4 text-[#3a606e] font-medium lg:text-base text-sm">Giới tính</label>
          <div className="w-3/4 flex items-center gap-6">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                  className="text-[#3a606e] text-base"
                />
                {g === "male" ? "Nam" : g === "female" ? "Nữ" : "Khác"}
              </label>
            ))}
          </div>
        </div>

        {/* Ngày sinh */}
        <div className="flex items-center justify-between">
          <label className="w-1/4 text-[#3a606e] font-medium lg:text-base text-sm">Ngày sinh</label>
          <input
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-[#3a606e] text-base"
          />
        </div>

        {/* Cập nhật */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#3a606e] text-white lg:px-6 px-4 py-2 rounded-lg cursor-pointer
              hover:bg-[#2f4d5a] transition lg:text-base text-sm"
          >
            Cập nhật
          </button>
        </div>

        {msg && (
          <p
            className={`text-sm mt-3 ${
              msg.toLowerCase().includes("thành công")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
      </form>
    </div>
  );
};
