import React, { useState, useEffect } from 'react'
import { Title } from "../../components/Title/Title";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from "../../redux/Auth/authApi";
import { useNavigate } from 'react-router-dom';
export const ProfileAdmin = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.auth.login)
  const token = localStorage.getItem("token");
  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", gender: "", birthday: ""
  })
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
    <div className="flex justify-center items-center">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-xl">
        <Title title="Thông tin cá nhân" className="text-xl mb-6 text-center" />

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Họ tên */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Họ và tên</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Email</label>
            <input
              onChange={handleChange}
              value={formData.email}
              name="email"
              type="email"
              disabled
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                  bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Số điện thoại</label>
            <input
              onChange={handleChange}
              name="phone"
              type="text"
              value={formData.phone}
              placeholder="Nhập số điện thoại"
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>

          {/* Giới tính */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Giới tính</label>
            <div className="w-3/4 flex items-center gap-6">
              {["male", "female", "other"].map((g) => (
                <label key={g} className="flex items-center gap-2">
                  <input
                    onChange={handleChange}
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    className="text-[#3a606e]"
                  />
                  {g === "male" ? "Nam" : g === "female" ? "Nữ" : "Khác"}
                </label>
              ))}
            </div>
          </div>

          {/* Ngày sinh */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Ngày sinh</label>
            <input
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>

          {/* Cập nhật */}
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={() => navigate('/admin/change-pass')}
              className="bg-[#3a606e] text-white px-6 py-2 rounded-lg cursor-pointer
                  hover:bg-[#2f4d5a] transition mx-4"
            >
              Đổi mật khẩu
            </button>
            <button
              type="submit"
              className="bg-[#3a606e] text-white px-6 py-2 rounded-lg cursor-pointer
                  hover:bg-[#2f4d5a] transition"
            >
              Cập nhật
            </button>
          </div>
          {msg && (
            <p
              className={`text-sm mt-3 ${msg.toLowerCase().includes("thành công")
                ? "text-green-600"
                : "text-red-600"
                }`}
            >
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
