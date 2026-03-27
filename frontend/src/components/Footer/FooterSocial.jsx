import React from 'react'
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export const FooterSocial = () => {
  return (
    <div className="text-white">
      <h2 className="font-bold lg:text-lg text-base mb-3">Kết nối với chúng tôi</h2>
      <div className="flex gap-4 lg:text-xl text-lg">
        <a
          href="https://www.facebook.com/eucyldt/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500"
        >
          <FaFacebook />
        </a>
        <a
          href="https://www.instagram.com/eucyldt/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.tiktok.com/@eucyldt"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-950"
        >
          <FaTiktok />
        </a>
        <a
          href="mailto:ducty9963@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500"
        >
          <MdEmail />
        </a>
      </div>
    </div>
  )
}
