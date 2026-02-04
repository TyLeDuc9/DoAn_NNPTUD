import React from 'react'

export const FooterAddress = () => {
    return (
        <address className="not-italic text-white">
            <h2 className="font-bold lg:text-lg text-base">Tiệm sách BookNest</h2>
            <ul className="space-y-1 lg:text-base text-sm mt-2 ">
                <li >Địa chỉ: TP. Hồng Ngự, Đồng Tháp</li>
                <li >
                    SĐT:
                    <a href="tel:0704555748" className='hover:text-green-300 duration-100 ease-in-out'>
                        0704555748
                    </a>
                </li>
                <li >
                    Email:
                    <a href="mailto:booknest@gmail.com" className='hover:text-green-300 duration-100 ease-in-out'>
                        ducty9963@gmail.com
                    </a>
                </li>
            </ul>
        </address>
    )
}
