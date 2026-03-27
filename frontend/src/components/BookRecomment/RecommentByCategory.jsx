import React from 'react'
import { Title } from '../Title/Title'
import { useRecommentBook } from '../../hooks/useRecommentBook'
import { Link } from "react-router-dom";
export const RecommentByCategory = ({ categorySlug }) => {
  const { recommentBook, loading, error } = useRecommentBook(categorySlug)

  if (loading) return <p>Đang tải sách liên quan...</p>
  if (error) return <p className="text-red-500">Lỗi: {error.message}</p>


  return (
    <div>
      <Title
        title="Sản phẩm liên quan"
        className="text-center bg-[#386572] py-2 text-white font-bold rounded-sm"
      />
      <div className="grid grid-cols-2 gap-4 mt-4">

        {recommentBook.map((book) => (
          <div
            key={book._id}
            className="flex flex-col items-center text-center p-2"
          >
            <Link to={`/products/${book.slug}`} className="w-full flex flex-col h-full">
              {book.images?.[0] && (
                <img
                  src={book.images[0]}
                  alt={book.name}
                  className="w-48 h-36 object-contain rounded mb-2"
                />
              )}

              <h3 className="text-sm font-medium text-[#25383d] hover:text-[#4d8898] line-clamp-2 mb-1">
                {book.name}
              </h3>

              <span className="text-red-500 font-bold mt-auto">
                {Number(book.price).toLocaleString('vi-VN')}₫
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>

    

  )
}
