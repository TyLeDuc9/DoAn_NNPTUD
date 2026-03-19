import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { useSearchParams } from "react-router-dom";
import { SearchAdmin } from "../../components/SearchAdmin/SearchAdmin";
import { useAllAddress } from "../../hooks/useAllAddress";
import { Pagination } from "antd";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const ShippingAddressEmployee = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageParam = parseInt(searchParams.get("page")) || 1;
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [sort, setSort] = useState("newest");
    const { setComponentsLoading } = useLoading();
    const { addresses, pagination, loading, error } = useAllAddress({
        page: currentPage,
        limit: 20,
        sort,
    });

    useEffect(() => {
        setSearchParams({ page: currentPage, sort });
    }, [currentPage, sort]);

    useEffect(() => {
        setCurrentPage(1);
    }, [sort]);

    useEffect(() => {
        setComponentsLoading(loading)
        setSearchParams({ page: currentPage, sort });
    }, [currentPage, sort, loading]);

    if (loading) return <ComponentLoading />;
    if (error) return <div className="p-6 text-center text-red-500">Lỗi: {error}</div>;

    const tdClass = "border p-2 border-gray-400"
    const thClass = "border border-gray-200 p-2";
    return (
        <div className="px-4 bg-white">
            <Title title="Quản lý địa chỉ giao hàng" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />
            <SearchAdmin />

            <div className="flex items-center justify-between my-8">
                <h2 className="text-lg font-medium">Danh sách địa chỉ giao hàng</h2>
                <div className="flex items-center">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border p-1 ml-6 rounded"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="border-collapse w-full">
                    <thead className="bg-[#386572] text-white text-center">
                        <tr>
                            <th className={thClass}>STT</th>
                            <th className={thClass}>Tên</th>
                            <th className={thClass}>Email</th>
                            <th className={thClass}>Tên người nhận</th>
                            <th className={thClass}>SĐT</th>
                            <th className={thClass}>Số nhà</th>
                            <th className={thClass}>Thành phố</th>
                            <th className={thClass}>Quận/Huyện</th>
                            <th className={thClass}>Phường/Xã</th>
                            <th className={thClass}>Mặc định</th>
                            <th className={thClass}>Ngày tạo</th>
                            <th className={thClass}>Cập nhật</th>

                        </tr>
                    </thead>

                    <tbody>
                        {addresses.map((group, groupIdx) => {
                            const userAddresses = group.addresses;
                            const rowSpan = userAddresses.length;

                            return userAddresses.map((addr, addrIdx) => (
                                <tr
                                    key={addr._id}
                                    className="text-center hover:bg-[#639eae]/80 hover:text-white transition"
                                >
                                    {/* Chỉ hiển thị user và email 1 lần ở row đầu */}
                                    {addrIdx === 0 && (
                                        <>
                                            <td rowSpan={rowSpan} className={tdClass}>
                                                {(currentPage - 1) * (pagination.limit || 20) + (groupIdx + 1)}
                                            </td>
                                            <td rowSpan={rowSpan} className={tdClass}>
                                                {group.user?.name}
                                            </td>
                                            <td rowSpan={rowSpan} className={tdClass}>
                                                {group.user?.email}
                                            </td>
                                        </>
                                    )}

                                    {/* Cột địa chỉ */}
                                    <td className={tdClass}>{addr.fullName}</td>
                                    <td className={tdClass}>{addr.phone}</td>
                                    <td className={tdClass}>{addr.address}</td>
                                    <td className={tdClass}>{addr.city}</td>
                                    <td className={tdClass}>{addr.district}</td>
                                    <td className={tdClass}>{addr.ward}</td>
                                    <td className="border p-2 text-green-600 font-medium">
                                        {addr.is_default ? "true" : ""}
                                    </td>
                                    <td className={tdClass}>
                                        {new Date(addr.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className={tdClass}>
                                        {new Date(addr.updatedAt).toLocaleString("vi-VN")}
                                    </td>

                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
            </div>


            <div className="flex justify-center py-8">
                <Pagination
                    current={pagination.page || currentPage}
                    pageSize={pagination.limit || 20}
                    total={pagination.total}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>

        </div>
    );
};
