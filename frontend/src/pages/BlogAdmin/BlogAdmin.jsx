import React, { useEffect, useState } from "react";
import { Title } from "../../components/Title/Title";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useAllBlog } from "../../hooks/useAllBlog";
import { Modal } from "antd";
import { useNavigate } from 'react-router-dom'
import { createBlog, deleteBlog } from "../../services/blogApi";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const BlogAdmin = () => {
  const { blogs, loading, error } = useAllBlog();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    bookName: "",
    images: [], // chứa cả ảnh cũ lẫn ảnh mới
  });
  const [selectedFiles, setSelectedFiles] = useState([]); // chỉ lưu ảnh mới upload
  const { setComponentsLoading } = useLoading();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    setComponentsLoading(loading)
  }, [loading])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files.map(f => URL.createObjectURL(f))]
    }));
    setSelectedFiles(prev => [...prev, ...files]); // lưu file gốc để gửi FormData
  };

  const handleRemoveImage = (index) => {
    const removed = formData.images[index];
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    // Nếu là ảnh mới (blob), xóa trong selectedFiles
    if (removed.startsWith("blob:")) {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/blog/edit/${id}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("bookName", formData.bookName);

      // thêm ảnh mới
      selectedFiles.forEach(file => data.append("images", file));

      await createBlog(data);
      alert("Thêm blog thành công!");
      setFormData({ title: "", content: "", images: [], bookName: "" });
      setSelectedFiles([]);
      setShowForm(false);
      window.location.reload()
    } catch (err) {
      alert(err.message);
    }
  };

  const hanldeDeleteBlog = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa không?");
    if (!confirmDelete) return;
    try {
      await deleteBlog(id)
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <ComponentLoading />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  return (
    <div className="px-4 bg-white min-h-screen">

      <Title title="Quản lý tin tức" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />
      {showForm && (
        <div className="flex justify-center items-center pt-16">
          <div className="p-8 rounded-xl shadow-sm w-full max-w-4xl">
            <Title title="Thêm tin tức" className="text-center pb-6 text-2xl font-semibold" />
            <form className="space-y-4" onSubmit={handleSubmit}>
              {["title", "content", "bookName"].map((field) => (
                <div key={field} className="flex items-start justify-between">
                  <label className="w-1/4 text-[#3a606e] font-medium">
                    {field === "bookName" ? "Tên sách" : field === "content" ? "Nội dung" : "Tiêu đề"}
                  </label>
                  {field === "content" ? (
                    <textarea
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      rows={6}
                      className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                    />
                  ) : (
                    <input
                      name={field}
                      type="text"
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between">
                <label className="w-1/4 text-[#3a606e] font-medium">Hình ảnh</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                />
              </div>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt={`preview-${i}`}
                        className="w-24 h-36 object-cover shadow-lg cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
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

      {/* Danh sách blog */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Danh sách tin tức</h2>
        <button
          className="flex items-center px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="mr-1" /> Thêm
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="border-collapse w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className={thClass}>STT</th>
              <th className={thClass}>Tiêu đề</th>
              <th className={thClass}>Nội dung</th>
              <th className={thClass}>Hình ảnh</th>
              <th className={thClass}>Tên sách</th>
              <th className={thClass}>Tác giả</th>
              <th className={thClass}>Ngày tạo</th>
              <th className={thClass}>Cập nhật</th>
              <th className={thClass}>Sửa</th>
              <th className={thClass}>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b, idx) => (
              <tr key={b._id} className="text-center text-sm hover:bg-[#639eae]/80 hover:text-white transition">
                <td className={tdClass}>{idx + 1}</td>
                <td className={tdClass}>{b.title}</td>
                <td className="border p-2 border-gray-400 text-xs">{b.content}</td>
                <td className={tdClass}>
                  {b.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={b.title}
                      className="w-24 h-20 object-cover mx-auto rounded mb-1"
                    />
                  ))}
                </td>
                <td className={tdClass}>{b.bookId?.name || "—"}</td>
                <td className={tdClass}>
                  {b.bookId?.author_id?.length > 0
                    ? b.bookId.author_id.map((a) => a.name).join(", ")
                    : "—"}
                </td>
                <td className={tdClass}>
                  {new Date(b.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className={tdClass}>
                  {new Date(b.updatedAt).toLocaleString("vi-VN")}
                </td>
                <td className={tdClass}>
                  <button
                    onClick={() => handleEdit(b._id)}
                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
                  >
                    <FaEdit className="inline mr-1" /> Sửa
                  </button>
                </td>
                <td className={tdClass}>
                  <button
                    onClick={() => hanldeDeleteBlog(b._id)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    <FaTrash className="inline mr-1" /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!previewImage} footer={null} onCancel={() => setPreviewImage(null)} centered>
        <img src={previewImage} alt="preview" className="w-full h-full rounded" />
      </Modal>
    </div>
  );
};
