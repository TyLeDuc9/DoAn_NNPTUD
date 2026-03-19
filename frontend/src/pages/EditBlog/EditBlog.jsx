import React, { useState, useEffect } from 'react';
import { Title } from "../../components/Title/Title";
import { Modal } from "antd";
import { getBlogById, updateBlog } from "../../services/blogApi";
import { useNavigate, useParams } from "react-router-dom";

export const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    bookName: "",
    images: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        const blog = res.blog;
        setFormData({
          title: blog.title,
          content: blog.content,
          bookName: blog.bookId?.name || "",
          images: blog.images || [],
        });
      } catch (err) {
        console.error(err);
        Modal.error({ title: "Lỗi", content: err.message || "Không thể tải blog" });
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files.map(f => URL.createObjectURL(f))],
    }));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    const removed = formData.images[index];
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    if (removed.startsWith("blob:")) {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();
      updateData.append("title", formData.title);
      updateData.append("content", formData.content);
      updateData.append("bookName", formData.bookName);

      // thêm ảnh cũ
      formData.images.forEach(img => {
        if (!img.startsWith("blob:")) updateData.append("oldImages", img);
      });

      // thêm ảnh mới
      selectedFiles.forEach(file => updateData.append("images", file));

      await updateBlog(id, updateData);
      navigate("/admin/blog");
    } catch (err) {
      console.error(err);
      Modal.error({ title: "Lỗi", content: err.message || "Cập nhật thất bại" });
    }
  };

  const handleCancel = () => {
    navigate("/admin/blog");
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-4xl">
        <Title title="Chỉnh sửa blog" className="text-xl mb-6 text-center" />
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
              required
            />
          </div>

          {/* Book Name */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Tên sách liên kết</label>
            <input
              type="text"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>

          {/* Content */}
          <div className="flex items-start justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Nội dung</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
              rows={6}
              required
            />
          </div>

          {/* Images */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 font-medium text-[#3a606e]">Hình ảnh (tối đa 10)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>

          {/* Preview & Remove */}
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

          {/* Buttons */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-[#3a606e] text-white px-6 py-2 rounded-lg hover:bg-[#2f4d5a]"
            >
              Cập nhật
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 ml-4 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      {/* Modal Preview */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
      >
        <img src={previewImage} alt="preview" className="w-full h-full rounded" />
      </Modal>
    </div>
  );
};
