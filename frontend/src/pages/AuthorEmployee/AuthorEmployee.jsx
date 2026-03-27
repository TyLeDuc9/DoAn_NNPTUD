import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { useAllAuthor } from "../../hooks/useAllAuthor";
import { createAuthor } from "../../services/authorApi";
import { SearchAdmin } from "../../components/SearchAdmin/SearchAdmin";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const AuthorEmployee = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sort, setSort] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const { pagination, loading, error, authors } = useAllAuthor(
    currentPage,
    20,
    "",
    sort,

  );
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [address, setAddress] = useState('')
  const { setComponentsLoading } = useLoading();

  useEffect(() => {
    setComponentsLoading(loading)
    setSearchParams({ page: currentPage, sort });
  }, [currentPage, loading]);

  useEffect(() => {
    setCurrentPage(1); // reset trang khi đổi sort
    setSearchParams({ page: 1, sort });
  }, [sort]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên tác giả!");
      return;
    }
    try {
      await createAuthor({ name, bio, address });
      setShowForm(false);
      setName("");
      setBio("");
      setAddress("");
      window.location.reload();
      setCurrentPage(1)
    } catch (err) {
      console.error("Lỗi khi thêm tác giả:", err);
      alert(err.message || "Đã xảy ra lỗi !");
    }
  };



  const handleEdit = (id) => {
    navigate(`/admin/author/edit/${id}`)
  }
  if (loading) return <ComponentLoading />;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  return (
    <div className="px-4 bg-white">

      {showForm && (
        <div className="flex justify-center items-center pt-16">
          <div className="p-8 rounded-xl shadow-sm w-full max-w-4xl">
            <Title title="Thêm tác giả" className="text-center pb-6 text-2xl font-semibold" />
            <form onSubmit={handleAdd} className="space-y-4" >
              {/* Họ tên */}
              <div className="flex items-center justify-between">
                <label className="w-1/4 text-[#3a606e] font-medium">Tên tác giả</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                />
              </div>
              <div className="flex items-start justify-between">
                <label className="w-1/4 text-[#3a606e] font-medium mt-2">Vài nét về tác giả</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-[#3a606e] resize-none"
                  placeholder="Nhập mô tả về tác giả..."
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <label className="w-1/4 text-[#3a606e] font-medium">Quốc tịch</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 rounded-lg bg-[#386572] text-white font-semibold transition cursor-pointer "
                >
                  Lưu
                </button>

                <button
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 ml-4 text-white cursor-pointer  font-semibold transition"
                  onClick={() => {
                    setShowForm(false);
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Title title="Quản lý tác giả" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />

      <SearchAdmin />
      <div className="flex items-center justify-between my-8">

        <h2 className="text-lg font-medium">Danh tác giả</h2>
        <div className="flex items-center">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border p-1 ml-6 rounded"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-3 py-1 ml-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
          >
            <FaPlus className="mr-1" /> Thêm
          </button>
        </div>

      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="border-collapse w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className={thClass}>STT</th>
              <th className={thClass}>Tên tác giả</th>
              <th className={thClass}>Vài nét về tác giả</th>
              <th className={thClass}>Quốc tịch</th>
              <th className={thClass}>Ngày tạo</th>
              <th className={thClass}>Cập nhật</th>
              <th className={thClass}>Sửa</th>
            </tr>
          </thead>

          <tbody>
            {authors.map((u, idx) => (
              <tr key={u._id} className="text-center bg-white
                    hover:bg-[#639eae]/80 hover:text-white transition-colors">
                <td className={tdClass}>{(currentPage - 1) * pagination.limit + idx + 1}</td>

                <td className={tdClass}>{u.name || "Chưa có"}</td>
                <td className={`${tdClass} text-sm text-left`}>
                  {u.bio || "Chưa có"}
                </td>
                <td className={tdClass}>{u.address || "Chưa có"}</td>
                <td className={tdClass}>{new Date(u.createdAt).toLocaleString("vi-VN")}</td>
                <td className={tdClass}>{new Date(u.updatedAt).toLocaleString("vi-VN")}</td>


                <td className={`${tdClass} text-center`}>
                  <div className='flex justify-center'>
                    <button
                      onClick={() => handleEdit(u._id)}
                      className=" flex items-center px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer">
                      <FaEdit className="mr-1" /> Sửa
                    </button>
                  </div>
                </td>

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
