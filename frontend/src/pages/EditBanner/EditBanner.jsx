  import React, { useState, useEffect } from "react";
  import { Title } from "../../components/Title/Title";
  import { useParams, useNavigate } from "react-router-dom";
  import { updateBanner, getBannerById } from "../../services/bannerApi";


  export const EditBanner = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      category_name: "",
      book_name: "",
      image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);


    useEffect(() => {
      const fetchBanner = async () => {
        try {
          const banner = await getBannerById(id);
          setFormData({
            category_name: banner.categoryId?.name || "",
            book_name: banner.bookId?.name || "",
            image: null,
          });

          setPreviewImage(banner.imageUrl);
        } catch (err) {
          console.error("Lỗi khi lấy banner:", err);
    
        }
      };

      fetchBanner();
    }, [id]);


    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        setPreviewImage(URL.createObjectURL(file));
      }
    };

    // 🔵 Gửi form cập nhật banner
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await updateBanner(id, formData);
        navigate("/admin/banner");
      } catch (err) {
       console.log(err);
      }
    };

    return (
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-xl">
          <Title title="Chỉnh sửa Banner" className="text-xl mb-6 text-center" />
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Danh mục */}
            <div className="flex items-center justify-between">
              <label className="w-1/4 text-[#3a606e] font-medium">
                Danh mục
              </label>
              <input
                type="text"
                name="category_name"
                placeholder="Tên danh mục"
                value={formData.category_name}
                onChange={handleChange}
                className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
              />
            </div>

            {/* Sách */}
            <div className="flex items-center justify-between">
              <label className="w-1/4 text-[#3a606e] font-medium">Sách</label>
              <input
                type="text"
                name="book_name"
                placeholder="Tên sách"
                value={formData.book_name}
                onChange={handleChange}
                className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
              />
            </div>

            {/* Ảnh */}
            <div className="flex items-center justify-between">
              <label className="w-1/4 text-[#3a606e] font-medium">Hình ảnh</label>
              <div className="w-3/4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border px-4 py-2 rounded-lg w-full"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="preview"
                    className="mt-3 w-full h-32"
                  />
                )}
              </div>


            </div>


            {/* Nút cập nhật */}
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
