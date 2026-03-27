import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { useAllUser } from "../../hooks/useAllUser";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
import { SearchAdmin } from "../../components/SearchAdmin/SearchAdmin";
export const UserEmployee = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sort, setSort] = useState("newest");
  const { setComponentsLoading } = useLoading();
  const { users, pagination, loading, error } = useAllUser(
    currentPage,
    20,
    "",
    sort,
    "user"
  );

  useEffect(() => {
    setSearchParams({ page: currentPage });
    setComponentsLoading(loading);
  }, [currentPage, loading]);




  if (loading) return <ComponentLoading />;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";


  return (
    <div className="px-4 bg-white">
      <Title title="Quản lý khách hàng" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />

      <SearchAdmin />
      <div className="flex items-center justify-between my-8">

        <h2 className="text-lg font-medium">Danh sách khách hàng</h2>
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

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="border-collapse w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className={thClass}>STT</th>
              <th className={thClass}>Tên</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>SĐT</th>
              <th className={thClass}>Giới tính</th>
              <th className={thClass}>Ngày sinh</th>
              <th className={thClass}>Ngày tạo</th>
              <th className={thClass}>Cập nhật</th>

            </tr>
          </thead>

          <tbody>
            {users.map((u, idx) => (
              <tr key={u._id} className="hover:bg-[#639eae] hover:text-white text-center font-normal transition">
                <td className={tdClass}>{idx + 1}</td>
                <td className={tdClass}>{u.name || "Chưa có"}</td>
                <td className={tdClass}>{u.email}</td>
                <td className={tdClass}>{u.phone || "Chưa có"}</td>
                <td className={tdClass}>
                  {u.gender === "male" ? "Nam" : "Nữ"}
                </td>
                <td className={tdClass}>
                  {u.birthday ? new Date(u.birthday).toLocaleDateString("vi-VN") : "Chưa có"}
                </td>
                <td className={tdClass}>{new Date(u.createdAt).toLocaleString("vi-VN")}</td>
                <td className={tdClass}>{new Date(u.updatedAt).toLocaleString("vi-VN")}</td>



              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-8 flex justify-center">
        <Pagination
          current={currentPage}
          total={pagination.total}
          pageSize={pagination.limit}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};
