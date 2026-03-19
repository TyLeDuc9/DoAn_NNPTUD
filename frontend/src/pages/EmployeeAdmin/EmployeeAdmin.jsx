import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import { useAllUser } from "../../hooks/useAllUser";
import { SearchAdmin } from "../../components/SearchAdmin/SearchAdmin";
import { deleteUser } from "../../services/userApi";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const EmployeeAdmin = () => {
  const navigate = useNavigate();
  const { setComponentsLoading } = useLoading();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || 1);

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sort, setSort] = useState("newest");

  // Gọi hook useAllUser với role là "employee" và sort
  const { users, pagination, loading, error, refetch } = useAllUser(
    currentPage,
    20,
    "", // Dùng cho search term nếu cần
    sort,
    "employee"
  );

  useEffect(() => {
    // Cập nhật URL khi page hoặc sort thay đổi
    setSearchParams({ page: currentPage, sort: sort });
    setComponentsLoading(loading)
  }, [currentPage, sort, setSearchParams]);

  const handleDeleteUser = async (id, email) => {
    // Lưu ý: Cần chắc chắn rằng deleteUser hoạt động cho cả user và employee
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa tài khoản nhân viên "${email}" không?`
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      alert("Xóa thành công!");
      refetch(); // Tải lại danh sách sau khi xóa
    } catch (err) {
      alert(err.message || "Xóa thất bại!");
    }
  };

  const handleEdit = (id) => {
    // Chuyển hướng đến trang chỉnh sửa nhân viên
    navigate(`/admin/employee/edit/${id}`);
  };

  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  if (loading) return <ComponentLoading />;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div className="px-4 bg-white">
      <Title
        title="Quản lý nhân viên"
        className="text-center text-3xl py-8 font-bold text-[#3a606e]"
      />
      <SearchAdmin />
      <div className="flex items-center justify-between my-8">

        <h2 className="text-lg font-medium">Danh sách nhân viên</h2>
        <div className="flex justify-between">
          <button onClick={() => navigate('/admin/register-employee')}
            className="px-3 cursor-pointer py-1 bg-blue-500 hover:bg-blue-600 rounded-sm text-white">
            Đăng kí nhân viên
          </button>
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
      </div>

      {/* Bảng danh sách nhân viên */}
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
              <th className={thClass}>Sửa</th>
              <th className={thClass}>Xóa</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, idx) => (
              <tr key={u._id} className="text-center bg-white
                    hover:bg-[#639eae]/80 hover:text-white transition-colors">
                <td className={tdClass}>{idx + 1}</td>
                <td className={tdClass}>{u.name || "Chưa có"}</td>
                <td className={tdClass}>{u.email}</td>
                <td className={tdClass}>{u.phone || "Chưa có"}</td>
                <td className={tdClass}>{u.gender || "Chưa có"}</td>
                <td className={tdClass}>
                  {u.birthday ? new Date(u.birthday).toLocaleDateString("vi-VN") : "Chưa có"}
                </td>
                <td className={tdClass}>{new Date(u.createdAt).toLocaleString("vi-VN")}</td>

                <td className={`${tdClass} text-center`}>
                  <button
                    onClick={() => handleEdit(u._id)}
                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer"
                  >
                    Sửa
                  </button>
                </td>

                <td className={`${tdClass} text-center`}>
                  <button
                    onClick={() => handleDeleteUser(u._id, u.email)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
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