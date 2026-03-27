import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Title } from "../../components/Title/Title";
import { SearchAdmin } from "../../components/SearchAdmin/SearchAdmin";
import { createBook } from "../../services/bookApi";
import { useAllBookAdmin } from "../../hooks/useAllBookAdmin";
import { Pagination } from "antd";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useAllCategory } from "../../hooks/useAllCategory";
import { useAllPublisher } from "../../hooks/useAllPublisher";
import { useAllAuthor } from "../../hooks/useAllAuthor";
import { Select } from "antd";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const BookEmployee = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || 1);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [sort, setSort] = useState("newest");
    const [showForm, setShowForm] = useState(false);
    const { setComponentsLoading } = useLoading();
    const { allCategory } = useAllCategory();
    const { publisher } = useAllPublisher();
    const { authors } = useAllAuthor(1, 9999);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_name: "",
        author_name: "",
        publisher_name: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBook(formData);
            alert("Thêm sách thành công!");
            window.location.reload();
            setShowForm(false);
            setCurrentPage(1);
        } catch (err) {
            alert(err.message);
        }
    };


    const handleEdit = (id) => {
        navigate(`/admin/book/edit/${id}`)
    }
    const { pagination = {}, loading, error, book = [] } =
        useAllBookAdmin(currentPage, 20, "", sort);
    useEffect(() => {
        setComponentsLoading(loading)
        setSearchParams({ page: currentPage, sort });
    }, [currentPage, loading]);


    useEffect(() => {
        setCurrentPage(1);
        setSearchParams({ page: 1, sort });
    }, [sort]);
    if (loading) return <ComponentLoading />;
    const tdClass = "border p-2 border-gray-400"
    const thClass = "border border-gray-200 p-2";
    return (
        <div className="px-4 bg-white">
            <Title title="Quản lý sách" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />
            {showForm && (
                <div className="flex justify-center items-center pt-16">
                    <div className="p-8 rounded-xl shadow-sm w-full max-w-4xl">
                        <Title title="Thêm sách" className="text-center pb-6 text-2xl font-semibold" />
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="w-1/4 text-[#3a606e] font-medium">Tên sách</label>
                                <input
                                    name="name"
                                    onChange={handleChange}
                                    type="text"
                                    className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                                />
                            </div>

                            <div className="flex items-start justify-between">
                                <label className="w-1/4 text-[#3a606e] font-medium mt-2">Mô tả</label>
                                <textarea
                                    name="description"
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a606e] resize-none"
                                ></textarea>
                            </div>


                            {/* Tác giả */}
                            <div className="flex items-center justify-between">
                                <label className="w-1/4 font-medium text-[#3a606e]">Tác giả</label>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    className="custom-select"
                                    style={{ width: "75%" }}
                                    value={formData.author_name}
                                    onChange={(value) => setFormData({ ...formData, author_name: value })}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="Chọn tác giả"
                                >
                                    {authors.map((a) => (
                                        <Select.Option key={a._id} value={a.name}>
                                            {a.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>


                            {/* Danh mục */}
                            <div className="flex items-center justify-between">
                                <label className="w-1/4 font-medium text-[#3a606e]">Danh mục</label>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    className="custom-select"
                                    style={{ width: "75%" }}
                                    value={formData.category_name}
                                    onChange={(value) =>
                                        setFormData({ ...formData, category_name: value })
                                    }
                                    showSearch
                                    optionFilterProp="label"
                                    options={allCategory.map((a) => ({
                                        label: a.name,
                                        value: a.name,
                                    }))}
                                />
                            </div>
                            {/* Nhà xuất bản */}
                            <div className="flex items-center justify-between">
                                <label className="w-1/4 font-medium text-[#3a606e]">Nhà xuất bản</label>
                                <Select

                                    allowClear

                                    className="custom-select"
                                    style={{ width: "75%" }}
                                    value={formData.publisher_name}
                                    onChange={(value) =>
                                        setFormData({ ...formData, publisher_name: value })
                                    }
                                    showSearch
                                    optionFilterProp="label"
                                    options={publisher.map((pub) => ({
                                        label: pub.name,
                                        value: pub.name,
                                    }))}
                                />
                            </div>


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

            {/* Danh sách sách */}

            <SearchAdmin />
            <div className="flex items-center justify-between my-8">

                <h2 className="text-lg font-medium">Danh sách Sách</h2>
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


            {loading ? (
                <p className="text-center">Đang tải...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-gradient-to-r from-[#386572] to-[#274853] text-white text-center">
                            <tr>
                                <th className={thClass}>STT</th>
                                <th className={thClass}>Tên sách</th>
                                <th className={`${thClass} w-[300px]`}>Mô tả</th>
                                <th className={thClass}>Tác giả</th>
                                <th className={thClass}>Danh mục</th>
                                <th className={thClass}>NXB</th>
                                <th className={thClass}>Ngày tạo</th>
                                <th className={thClass}>Cập nhật</th>
                                <th className={thClass}>Sửa</th>

                            </tr>
                        </thead>
                        <tbody>
                            {book.map((b, idx) => (
                                <tr
                                    key={b._id}
                                    className='text-center bg-white
                    hover:bg-[#639eae]/80 hover:text-white transition-colors'
                                >
                                    <td className={tdClass}>
                                        {(currentPage - 1) * pagination.limit + idx + 1}
                                    </td>
                                    <td className={tdClass}>
                                        {b.name}
                                    </td>
                                    <td className="border border-gray-400 p-2 text-left max-w-[300px] overflow-y-auto max-h-[80px]  text-xs">
                                        {b.description}
                                    </td>
                                    <td className={tdClass}>{b.author_id?.map(a => a.name).join(", ") || "—"}</td>
                                    <td className={tdClass}>{b.category_id?.map(c => c.name).join(", ") || "—"}</td>
                                    <td className={tdClass}>{b.publisher_id?.name || "—"}</td>
                                    <td className={tdClass}>
                                        {new Date(b.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className={tdClass}>
                                        {new Date(b.updatedAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className={`${tdClass} text-center`}>
                                        <button
                                            onClick={() => handleEdit(b._id)}
                                            className="flex items-center justify-center gap-1 px-3 py-1 rounded-lg
                       bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition"
                                        >
                                            <FaEdit /> Sửa
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            )}

            <div className="py-8 flex justify-center">
                <Pagination
                    current={currentPage}
                    total={pagination.total || 0}
                    pageSize={pagination.limit || 20}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};
