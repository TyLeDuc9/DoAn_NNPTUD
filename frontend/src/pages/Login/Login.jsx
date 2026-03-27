import React from 'react';
import bckUserLogin from '../../assets/background/bckUserLogin.jpg';
import { FormLogin } from '../../components/Form/FormLogin';
import logo from "../../assets/logo/image.png";

import { useNavigate } from 'react-router-dom';
export const Login = () => {
  const navigate = useNavigate();
  const handleHome = () => navigate('/');

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center 
        bg-cover bg-center bg-no-repeat px-4
      "
      style={{ backgroundImage: `url(${bckUserLogin})` }}
    >
      <div
        className="
          relative z-10 
          w-full max-w-sm sm:max-w-md lg:max-w-lg 
          bg-[#517688]/80 rounded-xl shadow-lg 
          p-6 sm:p-8
        "
      >
        {/* Logo luôn căn giữa form */}
        <img
          onClick={handleHome}
          src={logo}
          alt="logo"
          className="
            absolute lazy
            h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 
            -top-10 sm:-top-12 
            left-1/2 -translate-x-1/2 
            rounded-full cursor-pointer shadow-md
          "
        />

        <FormLogin />
      </div>
    </div>
  );
};
