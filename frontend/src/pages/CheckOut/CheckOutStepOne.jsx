import React from 'react';
import { FormAddressShipping } from '../../components/Form/FormAddressShipping';
import { CartCheckOut } from '../../components/CartModal/CartCheckOut';
import { useNavigate } from "react-router-dom";
export const CheckOutStepOne = () => {
  const navigate = useNavigate();
  const handleCart=()=>{
    navigate('/gio-hang')
  }
  const handlePayment=()=>{
    navigate('/checkout-step-two')
  }
  return (
    <div className="w-[85%] mx-auto mt-[8vh] bg-gray-50 rounded-xl shadow-xs">
      <div className="grid lg:grid-cols-12 grid-cols-1 min-h-screen">

        {/* Cột trái - Checkout */}
        <div className="col-span-6 bg-white p-8 border-r border-gray-200">
          <h1 className='text-[#364e57] text-2xl font-medium'>BookNest</h1>
          <FormAddressShipping />

        </div>

        {/* Cột phải - Cart summary */}
        <div className="col-span-6 bg-gray-100 p-8 rounded-r-xl">
          <CartCheckOut />
          <div className='flex lg:flex-row flex-col justify-between lg:mt-12'>
            <span onClick={handleCart} className='text-[#4c8696] text-sm lg:my-0 my-4 hover:text-[#639eae] text-center cursor-pointer mt-4'>Giỏ hàng </span>
            <button onClick={handlePayment} className='bg-[#4c8696] text-white p-4 lg:text-base text-sm rounded-sm hover:bg-[#639eae] cursor-pointer'
            >Tiếp tục dến phương thức thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
