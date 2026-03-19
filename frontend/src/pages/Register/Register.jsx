import React from 'react';
import bckRegister from '../../assets/background/bckRegister.jpg';
import logo from "../../assets/logo/image.png";
import { FormRegister } from '../../components/Form/FormRegister';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const handleHome = () => navigate('/');

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center 
        bg-cover bg-center bg-no-repeat px-4
      "
      style={{ backgroundImage: `url(${bckRegister})` }}
    >
      <div
        className="
          relative z-10 
          w-full max-w-sm sm:max-w-md lg:max-w-lg 
          bg-[#517688]/80 rounded-xl shadow-lg 
          p-6 sm:p-8
        "
      >
        {/* Logo căn giữa */}
        <img
          onClick={handleHome}
          src={logo}
          alt="logo"
          className="
            absolute 
            h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 
            -top-10 sm:-top-12 
            left-1/2 -translate-x-1/2 
            rounded-full cursor-pointer shadow-md
          "
        />

        <FormRegister />
      </div>
    </div>
  );
};
