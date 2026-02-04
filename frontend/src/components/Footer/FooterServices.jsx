import React from 'react'

export const FooterServices = () => {
    const navItems = [
        "Điều khoản sử dụng", "Chính sách bảo mật", "Hướng dẫn đặt hàng",
        "Chính sách đổi trả - hoàn tiền"
    ]
    return (
        <div>
            <h2 className='text-white font-bold lg:text-lg text-base'>Dịch vụ-Hỗ trợ</h2>
            <ul className="text-white space-y-1  mt-2 ">
                {navItems.map((item, index) => (
                    <li
                        key={index} className="lg:text-base text-sm" >
                        <a
                            className="hover:text-green-300 duration-100 ease-in-out" href="#">
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
