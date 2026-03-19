import React, { useState } from "react";
import { Title } from "../../components/Title/Title";
import { createBookDetails } from "../../services/bookDetailApi";
import { Modal } from "antd";

import { useNavigate } from "react-router-dom";
export const AddBookDetail = () => {

  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    isbn: "",
    book_name: "",
    images: [],
    price: "",
    stock_quantity: "",
    edition: "",
    pages: "",
    publication_year: "",
    language: "",
    dimensions: "",
    weight: "",
    volume: "",
    cover_type: "",
  });

  // Handle input text/number
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleChangePage = () => {
    navigate('/admin/book-detail?page=1&sort=newest')
  }

  // Handle file upload, giữ ảnh cũ + thêm mới
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // Xóa 1 ảnh
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // chỉ append những field có giá trị
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") return; // xử lý ảnh riêng bên dưới
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // thêm ảnh (nếu có)
      formData.images.forEach((file) => data.append("images", file));

      await createBookDetails(data);

      setFormData({
        isbn: "",
        book_name: "",
        images: [],
        price: "",
        stock_quantity: "",
        edition: "",
        pages: "",
        publication_year: "",
        language: "",
        dimensions: "",
        weight: "",
        volume: "",
        cover_type: "",
      });

      navigate("/admin/book-detail?page=1&sort=newest");
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div className="flex justify-center items-center pt-16">
      <div className="p-8 rounded-xl shadow-sm w-full max-w-4xl">
        <Title
          title="Thêm chi tiết sách"
          className="text-center pb-6 text-2xl font-semibold"
        />
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Input text/number */}
          {[
            { label: "ISBN", name: "isbn", type: "text" },
            { label: "Tên sách", name: "book_name", type: "text" },
            { label: "Giá", name: "price", type: "number" },
            { label: "Số lượng", name: "stock_quantity", type: "number" },
            { label: "Tái bản", name: "edition", type: "text" },
            { label: "Số trang", name: "pages", type: "number" },
            { label: "Năm xuất bản", name: "publication_year", type: "number" },
            { label: "Ngôn ngữ", name: "language", type: "text" },
            { label: "Kích thước", name: "dimensions", type: "text" },
            { label: "Trọng lượng", name: "weight", type: "number" },
            { label: "Tập", name: "volume", type: "number" },
            { label: "Bìa", name: "cover_type", type: "text" },
          ].map((field, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <label className="w-1/4 text-[#3a606e] font-medium">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
              />
            </div>
          ))}
         
          {/* Upload ảnh */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 font-medium text-[#3a606e]">
              Hình ảnh (tối đa 100)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>

          {/* Xem trước ảnh */}
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    onClick={() => setPreviewImage(URL.createObjectURL(img))}
                    src={URL.createObjectURL(img)}
                    alt={`preview-${i}`}
                    className="w-24 h-36 object-cover shadow-lg cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full cursor-pointer w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#386572] text-white font-semibold hover:bg-[#2b505b]"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={handleChangePage
              }
              className="px-4 py-2 ml-4 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
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
