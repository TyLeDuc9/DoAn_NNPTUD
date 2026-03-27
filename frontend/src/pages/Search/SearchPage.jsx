import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSearchBook } from "../../hooks/useSearchBook";
import { Title } from "../../components/Title/Title";
import { SortBook } from "../../components/Sort/SortBook";
import { BookCard } from "../../components/BookCard/BookCard";
import { Pagination } from "antd";
import { useLoading } from "../../context/LoadingContext";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";

export const SearchPage = () => {
  const { setComponentsLoading } = useLoading();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const sortParam = searchParams.get("sort") || "newest";

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sort, setSort] = useState(sortParam);

  const { books, pagination, loading, error } = useSearchBook(
    query,
    currentPage,
    20,
    sort
  );

  // Đồng bộ loading với context
  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);

  // Đồng bộ URL khi query, page hoặc sort thay đổi
  useEffect(() => {
    setSearchParams({ q: query, page: currentPage, sort });
  }, [query, currentPage, sort]);

  // Đồng bộ state khi URL thay đổi trực tiếp
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const s = searchParams.get("sort") || "newest";
    setCurrentPage(page);
    setSort(s);
  }, [searchParams]);

  if (!query)
    return (
      <p className="p-4 text-red-500">
        Vui lòng nhập từ khóa để tìm kiếm.
      </p>
    );
  if (loading) return <ComponentLoading />;
  if (error) return <p className="p-4 text-red-500">Lỗi: {error}</p>;

  return (
    <div className="bg-white w-[85%] mx-auto lg:my-12 my-8 gap-4">
      <Link className="hover:text-[#364e57] text-base" to="/">Trang chủ</Link> / Tìm kiếm
      <Title
        className="lg:text-xl sm:text-lg text-base font-medium mb-4 text-center uppercase my-8"
        title={`Kết quả tìm kiếm cho: ${query}`}
      />

      <div className="flex sm:justify-between sm:flex-row flex-col lg:justify-between items-center mb-6">
        <p className="text-[#2d525c] ml-4 font-medium mb-2 sm:mb-0">
          Sản phẩm phù hợp
        </p>
        <div className="mr-14 lg:mr-0 sm:mr-0">
          <SortBook sort={sort} setSort={setSort} />
        </div>
      </div>

      {books.length === 0 ? (
        <p className="text-center text-gray-500 my-8">
          Không tìm thấy sách nào phù hợp với từ khóa "{query}"
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {books.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>

          {pagination?.total > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pagination.limit || 20}
                total={pagination.total}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false} // nếu không muốn cho user thay đổi pageSize
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
