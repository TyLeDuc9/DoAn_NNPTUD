import React, { useState, useEffect } from 'react';
import bckForgot from '../../assets/background/bckForgot.jpg';
import logo from "../../assets/logo/image.png";
import { useNavigate } from 'react-router-dom';
import { Title } from '../../components/Title/Title';
import { useForgotPassword } from "../../hooks/useForgotPassword";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading, message, error, sendForgotPassword } = useForgotPassword();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendForgotPassword(email);
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
      style={{ backgroundImage: `url(${bckForgot})` }}
    >
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg bg-[#517688]/80 rounded-xl shadow-lg p-6 sm:p-8">
        <img
          src={logo}
          alt="logo"
          className="absolute h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 -top-10 sm:-top-12 left-1/2 -translate-x-1/2 rounded-full cursor-pointer shadow-md"
        />
        <Title title='Quên mật khẩu' className='text-center text-white lg:text-2xl text-lg font-semibold lg:mt-8 mt-4' />
        <p className='text-gray-400 lg:text-base text-sm my-4'>
          Nếu bạn đã có tài khoản,
          <span onClick={() => navigate('/tai-khoan/dang-nhap')} className='text-white cursor-pointer hover:text-white/80'>  đăng nhập</span>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-white/70 placeholder-white/60 lg:px-4 lg:py-2 
            w-full py-2 px-2 text-white lg:text-base text-sm lg:rounded-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-white/70"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-[#3b5866] hover:bg-white/80 font-semibold cursor-pointer lg:px-4 lg:py-2 py-2 px-3 lg:text-base my-4 text-sm lg:rounded-lg rounded-sm min-w-[120px] transition-all disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
          {message && <p className="mt-2 text-green-400 text-sm">{message}</p>}
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};
