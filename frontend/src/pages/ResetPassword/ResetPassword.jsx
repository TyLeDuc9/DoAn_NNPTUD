import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useResetPassword';
import { Title } from '../../components/Title/Title';
import bckReset from '../../assets/background/bckReset.jpg';
import logo from "../../assets/logo/image.png";

export const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, message, error, submitResetPassword } = useResetPassword();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    submitResetPassword(token, password, confirmPassword);
  };


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => navigate('/tai-khoan/dang-nhap'), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${bckReset})` }}
    >
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg bg-[#517688]/80 rounded-xl shadow-lg p-6 sm:p-8">
        <img
          src={logo}
          alt="logo"
          className="absolute h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 -top-10 sm:-top-12 left-1/2 -translate-x-1/2 rounded-full cursor-pointer shadow-md"
        />
        <Title title='Thiết lập lại mật khẩu' className='text-center text-white lg:text-2xl text-lg font-semibold lg:mt-8 mt-4' />
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu mới"
            className="border border-white/70 placeholder-white/60 lg:px-4 lg:py-2 w-full py-2 px-2 text-white text-base lg:rounded-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-white/70"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu"
            className="border border-white/70 placeholder-white/60 lg:px-4 lg:py-2 w-full py-2 px-2 text-white text-base lg:rounded-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-white/70"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-[#3b5866] hover:bg-white/80 font-semibold cursor-pointer lg:px-4 lg:py-2 py-2 px-3 lg:text-base my-4 text-sm lg:rounded-lg rounded-sm min-w-[140px] transition-all disabled:opacity-50"
            >
              {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </button>
          </div>
          {message && <p className="mt-2 text-green-400 text-sm">{message}</p>}
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};
