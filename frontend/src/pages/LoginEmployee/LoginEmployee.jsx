import React, { useState } from 'react';
import bckEmployee from '../../assets/background/bckEmployee.jpg';
import { Title } from '../../components/Title/Title';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useTogglePassword from '../../hooks/useTogglePassword';
import { useDispatch } from 'react-redux';
import { loginEmployee } from '../../redux/Auth/authApi';
import { useNavigate } from 'react-router-dom';

export const LoginEmployee = () => {
  const { showPassword, togglePassword } = useTogglePassword();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const adminData = { email, password };
    loginEmployee(adminData, dispatch, navigate, setErrorMsg);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${bckEmployee})` }}
    >
      <div className="bg-white/30 shadow-lg p-6 rounded-lg max-w-md w-full">
        <Title title="Đăng nhập nhân viên" className="text-center text-2xl text-white  font-semibold mb-12" />

        <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-100 text-white px-4 bg-white/30 py-2 rounded-lg focus:outline-none "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative my-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="w-full border text-white border-gray-100 bg-white/20 px-4 py-2 rounded-lg focus:outline-none "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white hover:text-black"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errorMsg && (
            <p className="text-red-600 text-center text-sm -mt-2">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="bg-white/80 hover:bg-white/60 cursor-pointer font-semibold py-2 rounded-lg text-black transition disabled:opacity-50"
          >
            Đăng nhập
          </button>
          <p className="text-sm text-white text-center"> <a href="/forgot-password" className=" font-medium hover:underline"> Quên mật khẩu? </a> </p>

        </form>
      </div>
    </div>
  );
};
