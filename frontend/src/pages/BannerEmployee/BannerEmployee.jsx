import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { useBanners } from "../../hooks/useBanners";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Title } from "../../components/Title/Title";
import { createBanner, deleteBanner } from "../../services/bannerApi";
import { useAllCategory } from "../../hooks/useAllCategory";
import { Select, message } from "antd";
import { useAllBookAdmin } from "../../hooks/useAllBookAdmin";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const BannerEmployee = () => {
  const { banners, loading, err } = useBanners();
  const navigate = useNavigate();
  const { allCategory, loading: categoryLoading } = useAllCategory();
  const { book } = useAllBookAdmin();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category_name: "",
    book_name: "",
    image: null,
  });
  const { setComponentsLoading } = useLoading();
  const formRef = useRef(null);
  useEffect(() => {
    setComponentsLoading(loading)
  }, [loading])
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  if (loading || categoryLoading) return <p>Đang tải...</p>;
  if (err) return <p>Lỗi: {err.message}</p>;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.category_name && !formData.book_name) {
        message.warning("Vui lòng chọn danh mục hoặc nhập tên sách");
        return;
      }
      if (!formData.image) {
        message.warning("Vui lòng chọn hình ảnh");
        return;
      }
      const data = {
        book_name: formData.book_name,
        category_name: formData.category_name,
        image: formData.image,
      };
      await createBanner(data);
      message.success("Tạo banner thành công!");
      setShowForm(false);
      setFormData({ category_name: "", book_name: "", image: null });
      window.location.reload();
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi tạo banner");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có muốn xóa không')
    if (!confirmDelete) return
    try {
      await deleteBanner(id)
      alert("Xóa thành công!");
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }


  };

  const handleEdit = (id) => {
    navigate(`/admin/banner/edit/${id}`);
  };


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  if (loading) return <ComponentLoading />;
  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  return (
    <div className="px-4 py-6 bg-white min-h-screen">
      <Title title="Quản lý Banner" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />

      {showForm && (
        <div ref={formRef} className="flex justify-center items-center pt-16">
          <div className="p-8 rounded-xl shadow-md w-full max-w-xl bg-gray-50">
            <Title title="Thêm banner" className="text-center pb-6 text-2xl font-semibold" />
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between">
                <label className="w-1/4 font-medium text-[#3a606e]">Danh mục</label>
                <Select
                  allowClear
                  className="custom-select"
                  style={{ width: "75%" }}
                  value={formData.category_name}
                  onChange={(value) => setFormData({ ...formData, category_name: value })}
                  showSearch
                  optionFilterProp="label"
                  options={allCategory.map((cat) => ({
                    label: cat.name,
                    value: cat.name,
                  }))}
                />

              </div>


              {/* NHẬP TÊN SÁCH */}
              <div className="flex items-center justify-between">
                <label className="w-1/4 font-medium text-[#3a606e]">Tên sách</label>
                <Select
                  allowClear
                  className="custom-select"
                  style={{ width: "75%" }}
                  value={formData.book_name}
                  onChange={(value) => setFormData({ ...formData, book_name: value })}
                  showSearch
                  optionFilterProp="label"
                  options={book.map((cat) => ({
                    label: cat.name,
                    value: cat.name,
                  }))}
                />

              </div>

              {/* HÌNH ẢNH */}
              <div className="flex items-center justify-between">
                <label className="w-1/4 font-medium text-[#3a606e]">Hình ảnh</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                  required
                />
              </div>

              {/* NÚT LƯU + HỦY */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#386572] hover:bg-[#5f818b] text-white font-semibold cursor-pointer"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 ml-4 rounded bg-gray-500 hover:bg-gray-400 text-white font-semibold cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLIDER PREVIEW */}
      <Slider {...settings}>
        {banners.slice(0, 4).map((banner) => (
          <div
            key={banner._id}
            className="w-full h-[70vh] overflow-hidden cursor-pointer"
          >
            <img
              src={banner.imageUrl}
              alt="Banner"
              className="w-full h-full object-contain focus:outline-none"
            />
          </div>
        ))}
      </Slider>

      {/* NÚT THÊM */}
      <div className="flex items-center justify-between mb-4 mt-12">
        <h2 className="text-lg font-medium">Danh sách Banners</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
        >
          <FaPlus className="mr-1" /> Thêm
        </button>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="border-collapse w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className={thClass}>STT</th>
              <th className={thClass}>Ảnh</th>
              <th className={thClass}>Danh mục / Sách</th>
              <th className={thClass}>Ngày tạo</th>
              <th className={thClass}>Cập nhật</th>
              <th className={thClass}>Sửa</th>
              <th className={thClass}>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, idx) => (
              <tr
                key={banner._id}
                className="text-center bg-white
                    hover:bg-[#639eae]/80 hover:text-white transition-colors"
              >
                <td className={tdClass}>{idx + 1}</td>
                <td className={tdClass}>
                  <img
                    src={banner.imageUrl}
                    alt="thumb"
                    className="w-48 h-20 mx-auto rounded"
                  />
                </td>
                <td className={tdClass}>
                  {banner.categoryId?.name ||
                    banner.bookId?.name ||
                    "Không có"}
                </td>
                <td className={tdClass}>
                  {new Date(banner.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className={tdClass}>
                  {new Date(banner.updatedAt).toLocaleString("vi-VN")}
                </td>
                <td className="border p-2 border-gray-400 text-center">
                  <button
                    onClick={() => handleEdit(banner._id)}
                    className="flex items-center justify-center px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer mx-auto"
                  >
                    <FaEdit className="mr-1" /> Sửa
                  </button>
                </td>
                <td className="border p-2  border-gray-400 text-center">
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex items-center justify-center px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer mx-auto"
                  >
                    <FaTrash className="mr-1" /> Xóa
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
