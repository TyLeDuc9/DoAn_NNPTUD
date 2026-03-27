import React from 'react';
import { FaFacebookMessenger } from "react-icons/fa";

export const Message = () => {
    const handleClick = () => {
        window.open("https://m.me/eucyldt", "_blank");
    }

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-[25%] right-4 w-12 h-12 cursor-pointer
                   text-white rounded-full 
                   flex items-center justify-center
                bg-[#4d8898] shadow-lg z-50"
        >
            <FaFacebookMessenger className='text-2xl' />
        </button>
    )
}
