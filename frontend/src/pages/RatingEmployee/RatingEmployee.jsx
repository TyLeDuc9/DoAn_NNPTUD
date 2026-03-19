import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { FaStar } from "react-icons/fa";
import { Pagination } from "antd";
import { useSearchParams } from "react-router-dom";
import { useAllRating } from "../../hooks/useAllRating";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const RatingEmployee = () => {
  // state & search params
  const [sort, setSort] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const { setComponentsLoading } = useLoading();
  // gọi hook lấy rating
  const { ratings, pagination, loading } = useAllRating(currentPage, 20, sort);

  // cập nhật URL khi đổi trang
  useEffect(() => {
    setComponentsLoading(loading)
    setSearchParams({ page: currentPage, sort });
  }, [currentPage, loading]);

  // đổi sắp xếp -> về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [sort]);

  // Hàm xóa tất cả đánh giá của một cuốn sách


  if (loading) return <ComponentLoading />;
  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  return (
    <div className="px-4 bg-white min-h-screen">
      <Title
        title="Quản lý đánh giá sách"
        className="text-center text-3xl py-8 font-bold text-[#3a606e]"

      />

      <div className="flex items-center justify-between my-8">
        <h2 className="text-lg font-medium">Danh sách đánh giá</h2>
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

      {/* Bảng hiển thị danh sách */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="border-collapse w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className={thClass}>STT</th>
              <th className={thClass}>Tên sách</th>
              <th className={thClass}>Người dùng</th>
              <th className={thClass}>Đánh giá (⭐)</th>
              <th className={thClass}>Tổng số đánh giá</th>
              <th className={thClass}>Trung bình</th>
              <th className={thClass}>Ngày tạo</th>
            </tr>
          </thead>

          <tbody>
            {ratings && ratings.length > 0 ? (
              ratings.map((r, idx) => {
                const userList = r.users || [];
                const rowSpan = userList.length > 0 ? userList.length : 1;

                return userList.length > 0 ? (
                  userList.map((u, userIdx) => (
                    <tr
                      key={`${r.bookId}-${u._id}-${userIdx}`}
                      className="text-center hover:bg-[#639eae]/80 hover:text-white transition"
                    >
                      {/* Cột STT & Tên sách chỉ hiển thị ở dòng đầu */}
                      {userIdx === 0 && (
                        <>
                          <td rowSpan={rowSpan} className={tdClass}>
                            {(currentPage - 1) * 20 + idx + 1}
                          </td>
                          <td rowSpan={rowSpan} className={tdClass}>
                            {r.book?.name || "—"}
                          </td>
                        </>
                      )}

                      {/* Cột thông tin người dùng */}
                      <td className={tdClass}>
                        <p className="">{u.name}</p>
                        <p className="text-sm text-gray-600">{u.email}</p>
                      </td>

                      {/* Cột rating (số sao từng user) */}
                      <td className={tdClass}>
                        {u.rating ? (
                          <span className="flex items-center justify-center gap-1 text-yellow-500">
                            {Array.from({ length: u.rating }).map((_, i) => (
                              <FaStar key={i} />
                            ))}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Các cột tổng chỉ hiển thị ở dòng đầu */}
                      {userIdx === 0 && (
                        <>
                          <td rowSpan={rowSpan} className={tdClass}>
                            {r.totalRatings}
                          </td>
                          <td rowSpan={rowSpan} className="border p-2 align-middle ">
                            <span className="flex items-center justify-center gap-1 text-yellow-500">
                              {r.averageRating?.toFixed(1)}  <FaStar />
                            </span>

                          </td>
                          <td rowSpan={rowSpan} className={tdClass}>
                            {new Date(r.latestCreatedAt).toLocaleString("vi-VN")}
                          </td>


                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr
                    key={r.bookId}
                    className="text-center hover:bg-[#639eae]/80 hover:text-white transition"
                  >
                    <td className={tdClass}>{(currentPage - 1) * 20 + idx + 1}</td>
                    <td className={tdClass}>{r.book?.name || "—"}</td>
                    <td className={tdClass}>Không có người dùng</td>
                    <td className={tdClass}>—</td>
                    <td className={tdClass}>{r.totalRatings}</td>
                    <td className={tdClass}>{r.averageRating?.toFixed(1)}</td>
                    <td className={tdClass}>
                      {new Date(r.latestCreatedAt).toLocaleString("vi-VN")}
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="p-4 text-center" colSpan={8}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="py-8 flex justify-center">
        <Pagination
          current={currentPage}
          total={pagination.total || 0}
          pageSize={pagination.limit || 20}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};
