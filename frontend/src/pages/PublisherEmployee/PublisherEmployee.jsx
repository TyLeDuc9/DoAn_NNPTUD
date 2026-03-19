import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Pagination, Modal } from "antd";
import { useAllPublisher } from "../../hooks/useAllPublisher";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchAdmin } from "../../components/SearchAdmin/SearchAdmin";
import { createPublisher } from "../../services/publisherApi";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const PublisherEmployee = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || 1);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");
    const [previewImage, setPreviewImage] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        image: null,
    });
    const { publisher, pagination, loading, error } = useAllPublisher(
        currentPage,
        20,
        "",
        sort
    );
    const { setComponentsLoading } = useLoading();

    useEffect(() => {
        setComponentsLoading(loading)
        setSearchParams({ page: currentPage, sort });
    }, [currentPage, sort, loading]);
    useEffect(() => {
        setCurrentPage(1);
        setSearchParams({ page: 1, sort });
    }, [sort]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            image: null,
        });
        setPreviewImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        try {
            await createPublisher(formData);
            window.location.reload();
            resetForm();
            setShowForm(false);
            setCurrentPage(1);
        } catch (err) {
            console.error("Lỗi tạo NXB:", err);

        }
    };


    const handleEdit = (id) => {
        navigate(`/admin/publisher/edit/${id}`)
    }



    if (loading) return <ComponentLoading />;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

    const tdClass = "border p-2 border-gray-400"
    const thClass = "border border-gray-200 p-2";
    return (
        <div className="px-12 bg-white min-h-screen">
            <Title title="Quản lý nhà xuất bản" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />
            {showForm && (
                <div className="flex justify-center items-center pt-16">
                    <div className="p-8 rounded-xl shadow-md w-full max-w-4xl bg-gray-50">
                        <Title title="Thêm nhà xuất bản" className="text-center pb-6 text-2xl font-semibold" />

                        <form className="space-y-4" onSubmit={handleSubmit}>

                            <div className="flex items-center justify-between">
                                <label className="w-1/4 text-[#3a606e]  font-medium">Tên NXB</label>
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

                            <div className="flex items-center justify-between">
                                <label className="w-1/4 text-[#3a606e]  font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="w-1/4 text-[#3a606e]  font-medium">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                                />
                            </div>

                            <div className="flex items-start justify-between">
                                <label className="w-1/4 text-[#3a606e]  font-medium mt-2">Địa chỉ</label>
                                <textarea
                                    rows={4}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-[#3a606e] resize-none"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="w-1/4 text-[#3a606e]  font-medium">Hình ảnh</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                                />
                            </div>

                            {previewImage && (
                                <div className="flex justify-center">
                                    <img src={previewImage} className="h-24 rounded object-contain" />
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button className="px-4 py-2 rounded bg-[#386572] hover:bg-[#5f818b] text-white font-semibold cursor-pointer">
                                    Lưu
                                </button>

                                <button
                                    type="button"
                                    className="px-4 py-2 ml-4 rounded bg-gray-500 hover:bg-gray-400 text-white font-semibold cursor-pointer"
                                    onClick={() => {
                                        resetForm();
                                        setShowForm(false);
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}


            <SearchAdmin />
            <div className="flex items-center justify-between my-8">

                <h2 className="text-lg font-medium">Danh nhà xuất bản</h2>
                <div className="flex items-center">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border p-1 ml-6 rounded"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center px-3 py-1 ml-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
                    >
                        <FaPlus className="mr-1" /> Thêm
                    </button>
                </div>

            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="border-collapse w-full">
                    <thead className="bg-[#386572] text-white text-center">
                        <tr>
                            <th className={thClass}>STT</th>
                            <th className={thClass}>Tên NXB</th>
                            <th className={thClass}>Ảnh</th>
                            <th className={thClass}>Email</th>
                            <th className={thClass}>SĐT</th>
                            <th className={thClass}>Địa chỉ</th>
                            <th className={thClass}>Ngày tạo</th>
                            <th className={thClass}>Cập nhật</th>
                            <th className={thClass}>Sửa</th>
                        </tr>
                    </thead>

                    <tbody>
                        {publisher.map((u, idx) => (
                            <tr key={u._id} className="text-center bg-white
                    hover:bg-[#639eae]/80 hover:text-white transition-colors">
                                <td className={tdClass}>{(currentPage - 1) * pagination.limit + idx + 1}</td>

                                <td className={tdClass}>{u.name || "Chưa có"}</td>
                                <td className={tdClass}>
                                    <img src={u.image} alt="thumb" className="h-14 mx-auto object-contain" />
                                </td>
                                <td className={tdClass}>{u.email}</td>
                                <td className={tdClass}>{u.phone}</td>
                                <td className={tdClass}>{u.address}</td>
                                <td className={tdClass}>
                                    {new Date(u.createdAt).toLocaleString("vi-VN")}
                                </td>
                                <td className={tdClass}>
                                    {new Date(u.updatedAt).toLocaleString("vi-VN")}
                                </td>
                                <td className={`${tdClass} text-center`}>
                                    <div className='flex justify-center'>
                                        <button
                                            onClick={() => handleEdit(u._id)}
                                            className=" flex items-center px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer">
                                            <FaEdit className="mr-1" /> Sửa
                                        </button>
                                    </div>
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="py-8 flex justify-center">
                <Pagination
                    current={currentPage}
                    total={pagination.total}
                    pageSize={pagination.limit}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};
