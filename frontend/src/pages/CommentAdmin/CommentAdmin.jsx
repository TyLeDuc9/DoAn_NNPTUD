import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { FaTrash } from "react-icons/fa";
import { useAllComment } from "../../hooks/useAllComment";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { deleteCommnetBook } from '../../services/commentApi'
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const CommentAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sort, setSort] = useState("newest");
  const { comments, loading, error, pagination } = useAllComment(
    currentPage,
    20,
    sort
  );
  const { setComponentsLoading } = useLoading();
  useEffect(() => {
    setComponentsLoading(loading)
    setSearchParams({ page: currentPage, sort });
  }, [currentPage, loading]);
  useEffect(() => {
    setCurrentPage(1);
    setSearchParams({ page: 1, sort });
  }, [sort]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`Bạn có muốn xóa không`)
    if (!confirmDelete) return
    try {
      await deleteCommnetBook(id)
      alert("Xóa thành công!");
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }

  }
  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  if (loading) return <ComponentLoading />;
  if (error) return <p className="p-4 text-red-500">Lỗi: {error}</p>;
  return (


    <div className="px-4 bg-white min-h-screen">
      <Title
        title="Quản lý danh sách bình luận"
        className="text-center text-3xl py-8 font-bold text-[#3a606e]"
      />

      <div className="flex items-center justify-between my-8">

        <h2 className="text-lg font-medium">Danh sách bình luận</h2>
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
              <th className={thClass}>Email</th>
              <th className={thClass}>Tên người dùng</th>
              <th className={thClass}>Tên sách</th>
              <th className={thClass}>Nội dung</th>
              <th className={thClass}>Ẩn danh</th>
              <th className={thClass}>Ngày tạo</th>
              <th className={thClass}>Cập nhật</th>
              <th className={thClass}>Xóa</th>
            </tr>
          </thead>

          <tbody>
            {comments.map((f, idx) => {
              const user = f.userId;
              const book = f.bookId
              return (
                <tr
                  key={f._id}
                  className="text-center hover:bg-[#639eae]/80 hover:text-white transition"
                >
                  <td className={tdClass}>{(currentPage - 1) * pagination.limit + idx + 1}</td>
                  <td className={tdClass}>{user?.email || "—"}</td>
                  <td className={tdClass}>{user?.name || "—"}</td>
                  <td className={tdClass}>{book?.name || "Chưa có tên"}</td>

                  <td className={tdClass}>{f.description}</td>
                  <td className={tdClass}>
                    {f.isAnonymous ? "Ẩn danh" : "Công khai"}
                  </td>
                  <td className={tdClass}>
                    {new Date(f.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className={tdClass}>
                    {new Date(f.updatedAt).toLocaleString("vi-VN")}
                  </td>

                  <td className={tdClass}>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition">
                      <FaTrash className="inline mr-1" /> Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="py-8 flex justify-center">
        <Pagination
          current={currentPage}
          total={pagination.total || 0}
          pageSize={pagination.limit || 20}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

    </div >
  )
}
