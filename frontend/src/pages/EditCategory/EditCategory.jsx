import React, { useState, useEffect } from "react";
import { updateCategory, getCategoryById } from "../../services/categoryApi";
import { useNavigate, useParams } from "react-router-dom";
import { Title } from "../../components/Title/Title";

export const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategoryById(id);
        setName(data.name);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory(id, { name });
      alert("Cập nhật thành công!");
      navigate("/admin/category");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-xl">
        <Title title="Chỉnh sửa thông tin khách hàng" className="text-xl mb-6 text-center" />
        <form onSubmit={handleSubmit} className="space-y-4" >
          {/* Họ tên */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Tên danh mục</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>

          {/* Cập nhật */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#3a606e] text-white px-6 py-2 rounded-lg cursor-pointer
                        hover:bg-[#2f4d5a] transition"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};
