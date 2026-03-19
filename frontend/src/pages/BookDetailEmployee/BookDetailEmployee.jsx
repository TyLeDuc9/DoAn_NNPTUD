import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { FaPlus, FaEdit } from "react-icons/fa";
import { SortBook } from "../../components/Sort/SortBook";
import { Pagination, Modal } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAllBook } from "../../hooks/useAllBook";
import { SearchAdmin } from "../../components/SearchAdmin/SearchAdmin";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
import { AiOutlineEye } from "react-icons/ai";
export const BookDetailEmployee = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sort, setSort] = useState("newest");
    const navigate = useNavigate();
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const [currentPage, setCurrentPage] = useState(pageParam);

    // ✅ state cho ảnh preview
    const [previewImage, setPreviewImage] = useState(null);

    const { books, pagination, loading, error } =
        useAllBook(currentPage, 10, sort);

    const { setComponentsLoading } = useLoading();
    useEffect(() => {
        setComponentsLoading(loading)
        setSearchParams({ page: currentPage, sort });
    }, [currentPage, setSearchParams, loading]);


    useEffect(() => {
        setCurrentPage(1);
        setSearchParams({ page: 1, sort });
    }, [sort]);




    if (loading) return <ComponentLoading />;
    if (error) return <p>Lỗi: {error}</p>;
    const handleAdd = () => {
        navigate('/admin/add-bookdetail')
    }
    const handleEdit = (id) => {
        navigate(`/admin/book-detail/edit/${id}`)
    }
    const tdClass = "border p-2 border-gray-400"
    const thClass = "border border-gray-200 p-2";
    return (
        <div className="px-4 bg-white min-h-screen">
            <Title title="Quản lý chi tiết sách" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />
            <SearchAdmin />
            <div className="flex justify-between my-8">
                <h2 className="text-lg font-medium">Danh sách chi tiết sách</h2>
                <div className="flex">
                    <SortBook sort={sort} setSort={setSort} />
                    <button
                        onClick={handleAdd}
                        className="flex items-center px-3 py-1 mx-4 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    >
                        <FaPlus className="mr-1" /> Thêm
                    </button>
                    <button
                        onClick={() => navigate('/employee/all-booklist')}
                        className="flex items-center px-3 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                    >
                        Xem dạng danh sách  <AiOutlineEye size={18} className="ml-1 mt-0.5" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="border-collapse w-full">
                    <thead className="bg-[#386572] text-white text-center">
                        <tr>
                            <th className={thClass}>STT</th>
                            <th className={thClass}>ISBN</th>
                            <th className={thClass}>Tên sách</th>
                            <th className={thClass}>Ảnh</th>
                            <th className={thClass}>Giá</th>
                            <th className={thClass}>Số lượng</th>
                            <th className={thClass}>Tái bản</th>
                            <th className={thClass}>Số trang</th>
                            <th className={thClass}>Năm xuất bản</th>
                            <th className={thClass}>Ngôn ngữ</th>
                            <th className={thClass}>Kích thước</th>
                            <th className={thClass}>Trọng lượng</th>
                            <th className={thClass}>Tập</th>
                            <th className={thClass}>Bìa</th>
                            <th className={thClass}>Ngày tạo</th>
                            <th className={thClass}>Cập nhật</th>
                            <th className={thClass}>Sửa</th>
                        </tr>
                    </thead>

                    <tbody>
                        {books.map((u, idx) => (
                            <tr
                                key={idx}
                                className="text-center bg-white 
                    hover:bg-[#639eae]/80 hover:text-white transition-colors text-sm"
                            >
                                <td className={tdClass}>{(currentPage - 1) * pagination.limit + idx + 1}</td>
                                <td className={tdClass}>{u.isbn}</td>
                                <td className={tdClass}>{u.name}</td>
                                <td className={tdClass}>
                                    <div

                                    >
                                        {u.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`book-img-${index}`}
                                                className="h-16 w-24 object-cover cursor-pointer"
                                                onClick={() => setPreviewImage(img)}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className={tdClass}>{u.price}</td>
                                <td className={tdClass}>{u.stock_quantity}</td>
                                <td className={tdClass}>{u.edition}</td>
                                <td className={tdClass}>{u.pages}</td>
                                <td className={tdClass}>{u.publication_year}</td>
                                <td className={tdClass}>{u.language}</td>
                                <td className={tdClass}>{u.dimensions}</td>
                                <td className={tdClass}>{u.weight}</td>
                                <td className={tdClass}>{u.volume || "Không có"}</td>
                                <td className={tdClass}>{u.cover_type}</td>
                                <td className={tdClass}>
                                    {new Date(u.createdAt).toLocaleString("vi-VN")}
                                </td>
                                <td className={tdClass}>
                                    {new Date(u.updatedAt).toLocaleString("vi-VN")}
                                </td>

                                <td className={`${tdClass} text-center`}>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleEdit(u.bookdetail_Id)}
                                            className="flex items-center px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer">
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

            {/* ✅ Modal xem ảnh phóng to */}
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
