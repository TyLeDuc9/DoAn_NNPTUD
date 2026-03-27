import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import logo from "../../assets/logo/image.png";

export const GlobalLoading = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-[#364e57] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <img src={logo} alt="Loading..." className="lg:w-64 lg:h-64 w-32 h-32 rounded-full" />
                <p className='text-gray-300 lg:text-4xl text-lg mt-6 font-semibold text-center'>
                    Tri thức –Uy tín- Chất lượng
                </p>
            </div>
        </div>
    );
}
