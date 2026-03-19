import React, { useEffect, useRef, useState } from "react";
import { searchBooks } from "../../services/bookDetailApi";
import { Link } from "react-router-dom";

export const SearchModal = ({ onClose, keyword }) => {
  const modalRef = useRef();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Đóng khi click ngoài modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Gọi API tìm kiếm gợi ý khi keyword thay đổi
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    let isMounted = true;

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const data = await searchBooks({ q: keyword, page: 1, limit: 3 });
        if (isMounted) {
          setSuggestions(data.books || []);
        }
      } catch (err) {
        console.error("Search suggestion error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 400);

    return () => {
      isMounted = false;
      clearTimeout(delayDebounce);
    };
  }, [keyword]);

  return (
    <div
      ref={modalRef}
      className="absolute top-5 lg:top-8 left-0 mt-2.5 w-full bg-white z-50 border border-gray-200"
    >
      {loading && (
        <p className="p-4 lg:text-sm text-xs text-gray-500 italic">Đang tìm kiếm...</p>
      )}

      {!loading && suggestions.length === 0 && keyword.trim() && (
        <p className="p-4 lg:text-sm text-xs text-gray-400 italic">
          Không tìm thấy sản phẩm
        </p>
      )}

      <ul className="divide-y divide-gray-100 w-full overflow-hidden">
        {suggestions.map((book) => (
          <li key={book._id}>
            <Link
              to={`/san-pham/${book._id}/${book.slug}`}
              className="flex items-center lg:gap-3 gap-2 p-1 lg:p-3 hover:bg-gray-50 transition"
              onClick={onClose}
            >
              <img
                src={Array.isArray(book.images) ? book.images[0] : book.images}
                alt={book.name}
                className="lg:w-12 lg:h-16 w-10 h-14 object-cover rounded border"
              />
              <div className="flex-1 lg:text-sm text-xs">
                <p className="font-medium line-clamp-1 text-[#2d525c]">{book.name}</p>

                {/* Nếu có giảm giá thì hiển thị cả giá gốc */}
                {Number(book.discountValue) > 0 ? (
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-red-500 font-semibold">
                      {Number(book.discountedPrice).toLocaleString("vi-VN")}₫
                    </p>
                    <p className="text-gray-400 font-semibold line-through text-xs">
                      {Number(book.price).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-700 font-semibold mt-1">
                    {Number(book.price).toLocaleString("vi-VN")}₫
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
