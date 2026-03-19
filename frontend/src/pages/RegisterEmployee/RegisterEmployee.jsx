import React, { useState } from 'react';
import { Title } from "../../components/Title/Title";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useTogglePassword from '../../hooks/useTogglePassword';
import { useDispatch } from 'react-redux';
import { registerEmployee } from '../../redux/Auth/authApi';
import { useNavigate } from 'react-router-dom';

export const RegisterEmployee = () => {
  const { showPassword, togglePassword } = useTogglePassword();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerEmployee(formData, dispatch, setErrorMsg);
    navigate('/admin/employee?page=1&sort=newest')
  };

  return (
    <div className="px-4 bg-white min-h-screen flex flex-col items-center">
      <Title 
        title="Đăng ký nhân viên" 
        className="text-center text-3xl py-8 font-bold text-[#3a606e]" 
      />
      <div className="w-full max-w-md bg-[#f1f5f9] rounded-xl shadow-md p-8">
        <Title 
          title="Tạo tài khoản" 
          className="text-center text-2xl font-semibold text-[#517688]" 
        />

        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#517688] focus:border-transparent transition"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#517688] focus:border-transparent transition"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#517688] transition"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

     
          <button
            type="submit"
            className="w-full bg-[#517688] hover:bg-[#3b5866] text-white py-3 rounded-lg font-medium transition"
          >
            Đăng ký
          </button>


        </form>
      </div>
    </div>
  )
}
