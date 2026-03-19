import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { useRevenueByDay } from "../../hooks/useRevenueByDay";
import { Pagination } from "antd";
import { useSearchParams } from "react-router-dom";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const Dashboard = () => {
  const [type, setType] = useState("day");
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sort, setSort] = useState("newest");
  // gọi hook với object { type, page, limit, sort }
  const { data, pagination, loading, error } = useRevenueByDay({
    type,
    page,
    limit: 20,
    sort,
  });
  const { setComponentsLoading } = useLoading();

  useEffect(() => {
    setComponentsLoading(loading)
    setSearchParams({ page: currentPage, sort });
  }, [currentPage, loading]);


  useEffect(() => {
    setCurrentPage(1); // reset trang khi đổi sort
    setSearchParams({ page: 1, sort });
  }, [sort]);

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(1); // reset page khi đổi type
  };
  if (loading) return <ComponentLoading />;
  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  return (
    <div className="px-4 bg-white min-h-screen">
      <Title
        title="Thống kê"
        className="text-center text-3xl py-8 font-bold text-[#3a606e]"
      />

      {/* Chọn loại thống kê */}
      <div className="mb-4 flex gap-4 justify-between">
        <div>
          <label className="mr-2 font-medium">Thống kê theo:</label>
          <select value={type} onChange={handleTypeChange} className="border px-2 py-1 rounded">
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </div>

        <div className="flex items-center">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border p-1 ml-6 rounded"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <>
          {/* Bảng thống kê */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="border-collapse w-full">
              <thead className="bg-[#386572] text-white text-center">
                <tr className="">
                  <th className={thClass}>{type === "day" ? "Ngày" : type === "month" ? "Tháng" : "Năm"}</th>
                  <th className={thClass}>Doanh thu</th>
                  <th className={thClass}>Số đơn</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} className="text-center bg-white
                    hover:bg-[#639eae]/80 hover:text-white transition-colors">
                    <td className={tdClass} >
                      {type === "day" && `${item._id.day}/${item._id.month}/${item._id.year}`}
                      {type === "month" && `${item._id.month}/${item._id.year}`}
                      {type === "year" && item._id.year}
                    </td>
                    <td className={tdClass} >{item.totalRevenue.toLocaleString()} đ</td>
                    <td className={tdClass}>{item.totalOrders}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          {/* Pagination */}
          <div className="py-8 flex justify-center">
            <Pagination
              current={page}
              total={pagination.total}
              pageSize={pagination.limit}
              onChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}
    </div>
  );
};
