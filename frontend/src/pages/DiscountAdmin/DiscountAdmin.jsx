import React, { useState } from "react";
import { Title } from "../../components/Title/Title";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useAllDiscount } from "../../hooks/useAllDiscount";
import { createDiscount, deleteDiscount } from "../../services/discountApi";
import { useNavigate } from "react-router-dom";
export const DiscountAdmin = () => {
  const { discount, loading, error } = useAllDiscount();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  // state lưu form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: "",
    discountType: "percentage",
    isActive: true,
    startDate: "",
    endDate: "",
  });

  // xử lý nhập form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  // xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDiscount(formData);
      setShowForm(false);
      window.location.reload();
    } catch (err) {
      alert("Lỗi khi thêm giảm giá!");
      console.error(err);
    }
  };

  const handleDeleteDiscount = async (id) => {
    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa mã giảm giá không?`)
    if (!confirmDelete) return;
    try {
      await deleteDiscount(id)
      window.location.reload()
    }
    catch (err) {
      alert(err.message);
    }
  }
  const handleEdit = (id) => {
    navigate(`/admin/discount/edit/${id}`)
  }


  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="px-4 bg-white min-h-screen">
      <Title
        title="Quản lý giảm giá toàn bộ sản phẩm"
        className="text-center text-3xl py-8 font-bold text-[#3a606e]"
      />

      {showForm && (
        <div className="flex justify-center items-center pt-16">
          <div className="p-8 rounded-xl shadow-sm w-full max-w-4xl bg-gray-50">
            <Title
              title="Thêm mã giảm giá"
              className="text-center pb-6 text-2xl font-semibold"
            />
            <form className="space-y-4" onSubmit={handleSubmit}>
              {[
                { label: "Tiêu đề", name: "title", type: "text" },
                { label: "Mô tả", name: "description", type: "text" },
                { label: "Giá trị", name: "value", type: "number" },
                {
                  label: "Loại giảm giá",
                  name: "discountType",
                  type: "select",
                  options: [
                    { label: "Giảm theo %", value: "percentage" },
                    { label: "Giảm số tiền", value: "fixed" },
                  ],
                },
                { label: "Hoạt động", name: "isActive", type: "checkbox" },
                { label: "Ngày bắt đầu", name: "startDate", type: "date" },
                { label: "Ngày kết thúc", name: "endDate", type: "date" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="font-medium mb-1">{field.label}</label>

                  {["text", "number", "date"].includes(field.type) && (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                      required={field.name !== "description"}
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === "checkbox" && (
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={formData[field.name]}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#386572] text-white font-semibold transition cursor-pointer"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 ml-4 text-white cursor-pointer font-semibold transition"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Danh sách giảm giá</h2>
        <button
          className="flex items-center px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="mr-1" /> Thêm
        </button>
      </div>

      {/* Bảng hiển thị danh sách */}
      <div className="border border-gray-400 rounded-sm overflow-hidden">
        <table className="border-collapse w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className="border border-gray-400 p-2">STT</th>
              <th className="border border-gray-400 p-2">Tiêu đề</th>
              <th className="border border-gray-400 p-2">Mô tả</th>
              <th className="border border-gray-400 p-2">Giá trị</th>
              <th className="border border-gray-400 p-2">Loại</th>
              <th className="border border-gray-400 p-2">Hoạt động</th>
              <th className="border border-gray-400 p-2">Ngày bắt đầu</th>
              <th className="border border-gray-400 p-2">Ngày kết thúc</th>
              <th className="border border-gray-400 p-2">Sửa</th>
              <th className="border border-gray-400 p-2">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {discount.map((d, idx) => (
              <tr
                key={d._id}
                className="text-center hover:bg-[#639eae]/80 hover:text-white transition"
              >
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{d.title}</td>
                <td className="border p-2">{d.description || "—"}</td>
                <td className="border p-2">{d.value}</td>
                <td className="border p-2">
                  {d.discountType === "percentage" ? "%" : "VNĐ"}
                </td>
                <td className="border p-2">
                  {d.isActive ? "Đang hoạt động" : "Tắt"}
                </td>
                <td className="border p-2">
                  {new Date(d.startDate).toLocaleString("vi-VN")}
                </td>
                <td className="border p-2">
                  {new Date(d.endDate).toLocaleString("vi-VN")}
                </td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(d._id)} className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition">
                    <FaEdit className="inline mr-1" /> Sửa
                  </button>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDeleteDiscount(d._id)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition">
                    <FaTrash className="inline mr-1" /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
