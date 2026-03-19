import React, { useState, useEffect } from 'react';
import { Title } from "../../components/Title/Title";
import { useAllCategory } from '../../hooks/useAllCategory';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { createCategory } from "../../services/categoryApi";
import { useNavigate } from "react-router-dom";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const CategoryEmployee = () => {
  const navigate = useNavigate();
  const { allCategory, loading, err } = useAllCategory();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const { setComponentsLoading } = useLoading();
  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);
  const handleAdd = async () => {
    if (!name.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }
    try {
      await createCategory(name);
      setShowForm(false);
      setName("");
      window.location.reload();
    } catch (error) {
      alert("Lỗi thêm danh mục!");
      console.log(error);
    }
  };


  const handleEdit = (id) => {
    navigate(`/admin/category/edit/${id}`)
  }
  if (loading) return <ComponentLoading />;
  if (err) return <p>Error: {err}</p>;
  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  return (
    <div className="px-4 bg-white min-h-screen">
      <Title
        title="Quản lý danh mục sản phẩm"
        className="text-center text-3xl py-8 font-bold text-[#3a606e]"
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Danh sách danh mục</h2>
        <button
          className="flex items-center px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"

          onClick={() => setShowForm(true)}
        >
          <FaPlus className="mr-1" /> Thêm
        </button>
      </div>

      {showForm && (
        <div className="p-5 bg-[#3f808f]/90 rounded-lg shadow-lg mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Nhập tên danh mục..."
              className="flex-1 bg-white text-gray-800 p-2 rounded-md 
              border border-white focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              className="px-4 py-2 rounded-lg bg-[#386572] text-white font-semibold transition cursor-pointer "
              onClick={handleAdd}
            >
              Lưu
            </button>

            <button
              className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white cursor-pointer  font-semibold transition"
              onClick={() => {
                setShowForm(false);
                setName("");
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}


      <div className='border border-gray-200 rounded-lg overflow-hidden'>
        <table className="border-collapse w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className={thClass}>STT</th>
              <th className={thClass}>Tên Danh mục</th>
              <th className={thClass}>Ngày tạo</th>
              <th className={thClass}>Cập nhật</th>
              <th className={thClass}>Sửa</th>
            </tr>
          </thead>

          <tbody>
            {allCategory.map((u, idx) => (
              <tr key={u._id} className="text-center bg-white
                    hover:bg-[#639eae]/80 hover:text-white transition-colors">
                <td className={tdClass}>{idx + 1}</td>
                <td className={tdClass}>{u.name || "Chưa có"}</td>
                <td className={tdClass}>{new Date(u.createdAt).toLocaleString("vi-VN")}</td>
                <td className={tdClass}>{new Date(u.updatedAt).toLocaleString("vi-VN")}</td>

                <td className="border p-2 text-center border-gray-400">
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

    </div>
  );
};
