import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { Title } from "../../components/Title/Title";
import { SortBook } from "../../components/Sort/SortBook";
import { useAllBook } from "../../hooks/useAllBook";
import { BookCard } from "../../components/BookCard/BookCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const AllBookListAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("newest");
  const navigate = useNavigate()
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageParam);

  const { books, pagination, loading, error } =
    useAllBook(currentPage, 40, sort);
  const { setComponentsLoading } = useLoading();
  useEffect(() => {
    setComponentsLoading(loading)
    setSearchParams({ page: currentPage, sort });
  }, [currentPage, setSearchParams, loading]);
  useEffect(() => {
    setCurrentPage(1);
    setSearchParams({ page: 1, sort })
  }, [sort])
  if (loading) return <ComponentLoading />;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <section className="px-4 bg-white py-12">
      <div className="flex justify-between items-center px-2 py-4">
        <Title
          title="Tất cả sách"
          className="text-lg capitalize font-medium text-[#2d525c] ml-2"
        />
        <div className="flex mr-2.5">
          <SortBook sort={sort} setSort={setSort} />
          <button
            onClick={() => navigate('/admin/book-detail')}
            className="flex items-center px-3 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
          >
            Xem dạng bảng  <AiOutlineEye size={18} className="ml-1 mt-0.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
      {pagination?.total > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={pagination.page || currentPage}
            pageSize={pagination.limit || 20}
            total={pagination.total}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

    </section>
  );
};
