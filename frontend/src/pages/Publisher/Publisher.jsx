import React, { useEffect, useState } from 'react';
import { useAllPublisher } from '../../hooks/useAllPublisher';
import { useSearchParams, Link } from "react-router-dom";
import { Title } from '../../components/Title/Title';
import { Pagination } from "antd";
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const Publisher = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const { setComponentsLoading } = useLoading()
  const { publisher, pagination, loading, error } = useAllPublisher(currentPage, 20);

  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage, setSearchParams]);


  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);

  if (loading) return <ComponentLoading />;

  if (error) return <p>Lỗi: {error.message || error}</p>;

  return (
    <div className="w-[85%] mx-auto min-h-screen py-10">
      <Title className='text-2xl text-red-500 text-center font-bold my-4' title='Nhà xuất bản' />
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-8">
        {publisher.map((item) => (
          <Link
            to={`/nha-xuat-ban/${item._id}/${item.slug}`}
            key={item._id}
            className="flex flex-col items-center bg-white shadow-md rounded-xl p-4 
               hover:shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-20 object-contain rounded-lg mb-3"
            />
            <span className="text-[#5f94a3] lg:text-base text-sm font-medium text-center">{item.name}</span>
          </Link>
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
    </div>
  );
};
