import React from 'react'
import banner2 from "../../assets/banner/banner2.jpg";
import logo from "../../assets/logo/image.png";
import { useNavigate } from 'react-router-dom';

export const BannerPages = () => {
    const navigate = useNavigate();
    return (
        <div className="relative cursor-pointer" onClick={() => navigate('/')}>
            <img
                src={banner2}
                className="lg:w-full lg:h-[50vh] w-full sm:h-[25vh] h-[20vh] object-cover"
                alt="banner"
            />
            <img
                src={logo}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 lg:h-36 lg:w-36 sm:w-24 sm:h-24 w-16 h-16 rounded-full -translate-y-1/2"
                alt="logo"
            />
        </div>

    )
}
