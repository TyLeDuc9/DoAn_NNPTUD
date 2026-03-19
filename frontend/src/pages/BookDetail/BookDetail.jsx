import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBookDetail } from "../../hooks/useBookDetail";
import { BookDetailImage } from "./BookDetailImage";
import { BookDetailInformation } from "./BookDetailInformation";
import { BookDetailDescription } from "./BookDetailDescription";
import { Comments } from '../../components/Comments/Comments'
import banner2 from '../../assets/banner/banner2.jpg'
import { RelatedBook } from "../../components/RelatedBook/RelatedBook";
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const BookDetail = () => {
  const { id, slug } = useParams();
  const { book, loading, error } = useBookDetail(id, slug);
  const [activeTab, setActiveTab] = useState("description");
  const { setComponentsLoading } = useLoading()
  useEffect(() => {
    setComponentsLoading(loading)
  }, [loading])
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id, slug]);
  if (loading) return <ComponentLoading />;

  if (error) return <p className="text-center mt-10 text-red-500">Lỗi: {error.message}</p>;
  if (!book) return <p className="text-center mt-10">Không tìm thấy sách</p>;

  return (
    <section>
      <div className="relative">
        <img src={banner2} className="lg:w-full lg:h-[50vh] w-full sm:h-[25vh] h-[20vh] object-cover" />
        <span className="absolute inset-0 flex text-[#3a606e] items-center 
        justify-center lg:text-3xl text-lg italic font-medium uppercase">
          {book.name}
        </span>
      </div>

      <div className="bg-[#ffffff] w-[85%] mx-auto my-16 min-h-screen">
        {/* Hình ảnh + thông tin */}
        <div className="flex lg:flex-row flex-col">
          <BookDetailImage book={book} />
          <BookDetailInformation book={book} />
        </div>

        {/* Tabs */}
        <div className="grid lg:grid-cols-12 grid-cols-1 lg:mt-28 mt-12">
          <div className="col-span-8 border-l-2 border-gray-100 border-r-2 border-b-2 shadow-sm">
            <div className="flex flex-col lg:text-base text-sm lg:flex-row text-white bg-[#386572] rounded-sm ">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-4 py-2 cursor-pointer ${activeTab === "description" ? "font-bold bg-[#639eae]" : "opacity-70"
                  }`}
              >
                Mô tả sản phẩm
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-4 py-2 cursor-pointer ${activeTab === "comments" ? "font-bold bg-[#639eae]" : "opacity-70"
                  }`}
              >
                Bình luận - Đánh giá
              </button>
            </div>

            <div className="bg-white p-4">
              {activeTab === "description" && <BookDetailDescription book={book} />}
              {activeTab === "comments" && <Comments bookId={book._id} />}
            </div>
          </div>

          <div className="col-span-4 lg:ml-8 lg:my-0 my-8 border-l-2 border-gray-100 border-r-2 border-b-2 shadow-sm">
            <RelatedBook />
          </div>
        </div>
      </div>
    </section>
  );
};
