import React, { useEffect, useState } from "react";
import { Title } from "../../components/Title/Title";
import { useNavigate, useParams } from "react-router-dom";
import { getBookDetailById, updateBookDetail } from "../../services/bookDetailApi";
import { Modal } from "antd";
export const EditBookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    isbn: "",
    book_name: "",
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
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  // 🟩 Lấy chi tiết sách khi load trang
  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const res = await getBookDetailById(id);
        const data = res.bookDetail;
        setFormData({
          isbn: data.isbn || "",
          book_name: data.book_id?.name || "",
          price: data.price || "",
          stock_quantity: data.stock_quantity || "",
          edition: data.edition || "",
          pages: data.pages || "",
          publication_year: data.publication_year || "",
          language: data.language || "",
          dimensions: data.dimensions || "",
          weight: data.weight || "",
          volume: data.volume || "",
          cover_type: data.cover_type || "",
          images: data.images || [],
        });
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sách:", err);
      }
    };
    fetchBookDetail();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files.map((file) => URL.createObjectURL(file))],
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
  };


  const handleRemoveImage = (index) => {
    const removedImage = formData.images[index];

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    if (removedImage.startsWith("blob:")) {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "images") updateData.append(key, formData[key]);
      });

      formData.images.forEach((img) => {
        if (!img.startsWith("blob:")) {
          updateData.append("oldImages", img);
        }
      });

      selectedFiles.forEach((file) => {
        updateData.append("images", file);
      });

      await updateBookDetail(id, updateData);
      navigate("/admin/book-detail?page=1&sort=newest");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };


  const handleCancel = () => {
    navigate("/admin/book-detail?page=1&sort=newest");
  };

  return (
    <div className="flex justify-center items-center pt-16">
      <div className="p-8 rounded-xl shadow-sm w-full max-w-4xl">
        <Title
          title="Cập nhật chi tiết sách"
          className="text-center pb-6 text-2xl font-semibold"
        />
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                value={formData[field.name] || ""}
                onChange={handleChange}
                disabled={field.name === "book_name"}
                className={`w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 
        ${field.name === "book_name"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "focus:ring-[#3a606e]"
                  }`}
              />
            </div>
          ))}

          <div className="flex items-center justify-between">
            <label className="w-1/4 font-medium text-[#3a606e]">
              Hình ảnh (tối đa 100)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>

          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    onClick={() => setPreviewImage(img)}
                    src={img}
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
