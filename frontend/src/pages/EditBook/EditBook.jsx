import React, { useEffect, useState } from "react";
import { Title } from "../../components/Title/Title";
import { getBookById, updateBook } from "../../services/bookApi";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import { useAllCategory } from "../../hooks/useAllCategory";
import { useAllAuthor } from "../../hooks/useAllAuthor";
import { useAllPublisher } from "../../hooks/useAllPublisher";

export const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { allCategory } = useAllCategory();
  const { authors } = useAllAuthor();
  const { publisher } = useAllPublisher();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_name: [],
    author_name: [],
    publisher_name: "",
  });

  // Lấy thông tin sách khi vào trang
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          category_name: data.category_id?.map((c) => c.name) || [],
          author_name: data.author_id?.map((a) => a.name) || [],
          publisher_name: data.publisher_id?.name || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchBook();
  }, [id]);

  // Cập nhật form khi nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // Gửi form cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBook(id, formData);
      alert("✅ Cập nhật sách thành công!");
      navigate("/admin/book");
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-4xl">
        <Title title="Chỉnh sửa thông tin sách" className="text-xl mb-6 text-center" />
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Tên sách */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Tên sách</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
              required
            />
          </div>

          {/* Mô tả */}
          <div className="flex items-start justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium mt-2">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#3a606e] resize-none"
            ></textarea>
          </div>

          {/* Tác giả */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Tác giả</label>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "75%" }}
              value={formData.author_name}
              onChange={handleSelect("author_name")}
              showSearch
              placeholder="Chọn tác giả"
              optionFilterProp="label"
              options={authors.map((a) => ({ label: a.name, value: a.name }))}
            />
          </div>

          {/* Danh mục */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Danh mục</label>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "75%" }}
              value={formData.category_name}
              onChange={handleSelect("category_name")}
              showSearch
              placeholder="Chọn danh mục"
              optionFilterProp="label"
              options={allCategory.map((c) => ({ label: c.name, value: c.name }))}
            />
          </div>

          {/* Nhà xuất bản */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Nhà xuất bản</label>
            <Select
              allowClear
              style={{ width: "75%" }}
              value={formData.publisher_name}
              onChange={handleSelect("publisher_name")}
              placeholder="Chọn NXB"
              optionFilterProp="label"
              options={publisher.map((p) => ({ label: p.name, value: p.name }))}
            />
          </div>

          <div className="flex justify-end pt-6">
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
