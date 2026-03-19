import React, { useState, useEffect } from 'react';
import { Title } from '../Title/Title';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useTogglePassword from '../../hooks/useTogglePassword';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/Auth/authApi';
import { useNavigate } from 'react-router-dom';

export const FormRegister = () => {
  const { showPassword, togglePassword } = useTogglePassword();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, isFetching } = useSelector((state) => state.auth.register);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    await registerUser(formData, dispatch, setErrorMsg);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/tai-khoan/dang-nhap"), 1000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="lg:max-w-md mx-auto lg:p-6 lg:my-8">
      <Title title="Tạo tài khoản" className="text-center text-2xl text-white font-semibold" />

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border lg:px-4 lg:py-2 py-2 px-2 text-white text-base lg:rounded-lg rounded-sm focus:outline-none"
        />

        {/* Password + toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="w-full border lg:px-4 lg:py-2 py-2 px-2 text-white text-base lg:rounded-lg rounded-sm focus:outline-none "
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Messages */}
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        {success && <p className="text-green-500 text-sm text-center">Đăng ký thành công!</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isFetching}
          className="bg-white text-[#3b5866] hover:bg-white/70 font-semibold cursor-pointer lg:px-4 lg:py-2 py-2 px-2
          lg:text-base text-sm lg:rounded-lg rounded-sm transition disabled:opacity-50"
        >
          {isFetching ? "Đang xử lý..." : "Đăng ký"}
        </button>

        {/* Links */}
        <p className="lg:text-sm text-xs text-gray-200 text-center">
          <a href="/tai-khoan/dang-nhap" className="text-white hover:underline">Đăng nhập</a> |
          <a href="/" className="text-white hover:underline ml-1">Trang chủ</a>
        </p>
      </form>
    </div>
  );
};
