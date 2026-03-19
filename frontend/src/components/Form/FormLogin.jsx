import React, { useState } from 'react'
import { Title } from '../Title/Title'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useTogglePassword from '../../hooks/useTogglePassword';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/Auth/authApi';
import { fetchCart } from '../../redux/Cart/apiCart';
import { useNavigate } from 'react-router-dom';
import { LoginEmail } from '../Login/LoginEmail';
// import { LoginFacebook } from '../Login/LoginFacebook';

export const FormLogin = () => {
  const { showPassword, togglePassword } = useTogglePassword();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching, error } = useSelector((state) => state.auth.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const res = await loginUser({ email, password }, dispatch, setErrorMsg);

    if (res?.user) {
      await fetchCart(dispatch);
      navigate("/");
    }
  };


  return (
    <div className="lg:max-w-md mx-auto lg:p-6 lg:my-8">
      <Title title='Thông tin đăng nhập' className='text-center text-white lg:text-2xl text-lg font-semibold' />

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border lg:px-4 lg:py-2 py-2 px-2 text-white text-base lg:rounded-lg rounded-sm focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Mật khẩu */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="w-full border lg:px-4 lg:py-2 py-2 px-2 text-white text-base lg:rounded-lg rounded-sm focus:outline-none "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#3a606e]"
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Hiển thị lỗi */}
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        {error && !errorMsg && (
          <p className="text-red-500 text-sm">Đăng nhập thất bại!</p>
        )}

        {/* Nút submit */}
        <button
          type="submit"
          disabled={isFetching}
          className="bg-white text-[#3b5866] hover:bg-white/70 font-semibold cursor-pointer lg:px-4 lg:py-2 py-2 px-2
          lg:text-base text-sm lg:rounded-lg rounded-sm transition disabled:opacity-50"
        >
          {isFetching ? "Đang xử lý..." : "Đăng nhập"}
        </button>
        <div className="w-full flex items-center justify-center">
          <LoginEmail />
          {/* <LoginFacebook /> */}
        </div>

        {/* Link đăng ký */}
        <p className="lg:text-sm text-xs text-gray-200 text-center">
          Bạn chưa có tài khoản?{" "}
          <a href="/tai-khoan/dang-ky" className="text-white font-medium hover:underline">
            Đăng ký
          </a>
        </p>

        {/* Quên mật khẩu */}
        <p className="lg:text-sm text-xs text-gray-600 text-center">
          <a href="/forgot-password" className="text-white font-medium hover:underline">
            Quên mật khẩu?
          </a>
        </p>
      </form>
    </div>
  )
}
