import React from 'react';
import { Link } from 'react-router-dom';

export const BookCard = ({ book }) => {
  // ✅ Lấy giá trị giảm giá
  const discountValue = Number(book.discountValue || book.bookDiscount?.value || 0);

  // ✅ Lấy loại giảm giá (percentage/fixed), fallback nếu thiếu
  let discountType = (book.discountType || book.bookDiscount?.discountType || "").toLowerCase();
  if (!discountType) {
    discountType = discountValue <= 100 ? "percentage" : "fixed";
  }

  // ✅ Kiểm tra có giảm giá
  const hasDiscount = discountValue > 0;

  return (
    <Link
      to={`/san-pham/${book.book_id?._id || book._id}/${book.slug || book.book_id?.slug}?volume=${book.volume || '?'}`}
      className="border border-gray-200 rounded shadow-sm hover:shadow-lg
             cursor-pointer duration-200 ease-in-out bg-white max-w-52 min-h-24 block w-[90%] mx-auto my-2 relative"
    >
      <div className="relative">
        <img
          src={Array.isArray(book.images) ? book.images[0] : book.images}
          alt={book.name}
          loading="lazy"
          className="lg:w-32 lg:h-52 sm:w-32 sm:h-52 w-20 h-36 object-cover mx-auto rounded pt-4"
        />

        {/* ✅ Hiển thị tag giảm giá */}
        {hasDiscount && (
          <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountType === "percentage"
              ? `-${discountValue}%`
              : `-${discountValue.toLocaleString("vi-VN")}₫`}
          </span>
        )}
      </div>

      <div className="text-left m-2">
        <h3 className="text-[#25383d] lg:text-base text-sm font-medium hover:text-[#4d8898] cursor-pointer line-clamp-1">
          {book.name} {book.book_id?.name} {book.volume && `Tập-${book.volume}`}
        </h3>

        {/* ✅ Nếu có giảm giá: hiển thị giá sau giảm (từ backend) */}
        {hasDiscount ? (
          <div className="flex justify-between">
            <p className="text-red-400 font-semibold">
              {Number(book.discountedPrice).toLocaleString('vi-VN')}₫
            </p>
            <p className="text-gray-500 font-semibold line-through">
              {Number(book.price).toLocaleString('vi-VN')}₫
            </p>
          </div>
        ) : (
          <p className="text-red-400 lg:text-base text-sm font-semibold">
            {Number(book.price).toLocaleString('vi-VN')}₫
          </p>
        )}
      </div>
    </Link>
  );
};
