import React from 'react';
import { useSelector } from 'react-redux';

export const CartCheckOut = () => {
  const { cart } = useSelector((state) => state.cart);
  const shippingFee = cart?.totalPrice > 300000 ? 0 : 25000;
  const totalAmount = (cart?.totalPrice || 0) + shippingFee;

  return (
    <div>
      {/* Danh sách sản phẩm */}
      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {(cart?.items || []).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between lg:gap-4 mt-2"
          >
            <div className="flex items-center lg:gap-2 gap-1">
              <div className="relative w-full">
                <img
                  src={item.image ||item.bookdetail_id?.images?.[0] }
                  alt={item.name}
                  className="lg:h-24 lg:w-20 w-12 h-20 object-contain rounded"
                />
                <span
                  className="absolute top-0 lg:-top-2 -right-1.5 lg:-right-2 bg-red-500 
                                text-white lg:text-xs text-[10px] font-medium flex items-center lg:p-2.5 p-2 justify-center lg:h-4 lg:w-4 w-2 h-2 rounded-full"
                >
                  {item.quantity}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="font-medium text-xs text-gray-700 lg:text-sm line-clamp-1 truncate lg:max-w-[360px] max-w-[150px]" title={item.name}>
                  {item.name || item.bookdetail_id?.book_id?.name}
                </div>
                {item.volume && (
                  <span className="text-xs text-gray-500 mt-1">
                    Tập {item.volume}
                  </span>
                )}
                <span className="text-xs text-gray-500 mt-1">
                  {item.cover_type}
                </span>
              </div>

            </div>

            <span className="lg:text-sm text-xs font-semibold text-gray-700">
              {item.price.toLocaleString()} ₫
            </span>
          </div>
        ))}
      </div>

      {/* Tổng kết giá */}
      {cart?.items?.length > 0 && (
        <div className="lg:mt-8 mt-4 border-t border-gray-300 pt-4 space-y-2">
          <p className='text-gray-700 lg:text-base text-sm'>(Miễn phí vận chuyển với đơn hàng từ 300.000 VND)</p>
          <div className="flex justify-between lg:text-base text-sm text-gray-700">
            <span>Tổng tiền hàng:</span>
            <span>{cart.totalPrice?.toLocaleString()} ₫</span>
          </div>

          <div className="flex justify-between lg:text-base text-sm text-gray-700">
            <span>Phí vận chuyển:</span>
            <span>
              {shippingFee > 0 ? `${shippingFee.toLocaleString()} ₫` : '0đ'}
            </span>
          </div>

          <div className="flex justify-between lg:text-lg text-base font-semibold text-gray-900 mt-3 border-t border-gray-300 pt-3">
            <span>Thành tiền:</span>
            <span>{totalAmount.toLocaleString()} ₫</span>
          </div>
        </div>
      )}
    </div>
  );
};
