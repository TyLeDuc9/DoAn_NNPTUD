import React, { useEffect, useState } from 'react'
import { Title } from "../../components/Title/Title";
import { getAuthorById, updateAuthor } from '../../services/authorApi'
import { useNavigate, useParams } from 'react-router-dom';
export const EditAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate()


  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    address: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuthorById(id)
        setFormData({
          name: data.name,
          bio: data.bio,
          address: data.address
        })

      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [id])

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev => ({ ...prev, [name]: value })))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAuthor(id, formData)
      alert("Cập nhật thành công!");
      navigate("/admin/author");
    } catch (err) {
      console.log(err);
    }

  }
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-4xl">
        <Title title="Chỉnh sửa thông tin tác giả" className="text-xl mb-6 text-center" />
        <form onSubmit={handleSubmit} className="space-y-4" >
          {/* Họ tên */}
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Tên tác giả</label>
            <input
              name='name'
              onChange={handleChange}
              value={formData.name}
              type="text"
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>
          <div className="flex items-start justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium mt-2">Vài nét về tác giả</label>
            <textarea
              name='bio'
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-[#3a606e] resize-none"
              placeholder="Nhập mô tả về tác giả..."
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <label className="w-1/4 text-[#3a606e] font-medium">Quốc tịch</label>
            <input
              name='address'
              onChange={handleChange}
              value={formData.address}
              type="text"
              className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
            />
          </div>
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
  )
}
