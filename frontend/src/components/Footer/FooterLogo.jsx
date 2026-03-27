import React from 'react'
import logo from "../../assets/logo/image.png";
export const FooterLogo = () => {
    return (
        <div className='lg:pt-8 pt-4 flex items-center'>
            <span className='lg:text-3xl sm:text-2xl text-lg font-semibold italic text-white mr-4 '>BookNest</span>
            <img
                src={logo}
                className=" h-20 w-20 rounded-full"
                alt="logo"
            />
        </div>
    )
}
