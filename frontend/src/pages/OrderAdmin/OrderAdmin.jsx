import React, { useState, useEffect } from "react";
import { Title } from "../../components/Title/Title";
import { useOrderStatus } from "../../hooks/useOrderStatus";
import { Pagination } from "antd";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const OrderAdmin = () => {
  const tabs = [
    { name: "Pending", key: "pending", color: "bg-yellow-400" },
    { name: "Confirmed", key: "confirmed", color: "bg-blue-400" },
    { name: "Completed", key: "completed", color: "bg-green-400" },
    { name: "Cancelled", key: "cancelled", color: "bg-red-400" }
  ];
  const { setComponentsLoading } = useLoading();
  const [sort, setSort] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [activeTab, setActiveTab] = useState(searchParams.get("status") || "pending");
  const navigate = useNavigate()

  const { orders, pagination, loading, error } = useOrderStatus(activeTab, currentPage, 20, sort);

  useEffect(() => {
    setComponentsLoading(loading)
    setSearchParams({ page: currentPage, sort, status: activeTab });
  }, [currentPage, sort, activeTab, loading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sort, activeTab]);

  const handleOrderDetail = async (orderId) => {
    navigate(`/admin/order-detail/${orderId}`)
  }

  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  if (loading) return <ComponentLoading />;
  if (error) return <p className="p-4 text-red-500">Lỗi: {error}</p>;
  return (
    <div className="px-4 bg-white">
      <Title title="Quản lý đơn hàng" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />

      {/* Tab và sort */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 mr-2 rounded text-white cursor-pointer ${activeTab === tab.key ? tab.color : "bg-gray-400"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div>
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

      {/* Nội dung tab */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="border-collapse w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className={thClass}>STT</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Mã đơn hàng</th>
              <th className={thClass}>Xem chi tiết</th>
              <th className={thClass}>Trạng thái thanh toán</th>
              <th className={thClass}>Tổng tiền</th>
              <th className={thClass}>Thanh toán</th>
              <th className={thClass}>Trạng thái đơn hàng</th>
              <th className={thClass}>Ngày tạo</th>
              <th className={thClass}>Xóa</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((item, idx) => {
              const user = item.userId
              return (
                <tr key={idx} className="text-center transition">
                  <td className={tdClass}>{(currentPage - 1) * pagination.limit + idx + 1}</td>
                  <td className={tdClass}>{user.email}</td>
                  <td className={`${tdClass} text-red-600 cursor-pointer hover:text-red-400 transition-all`} onClick={() => handleOrderDetail(item._id)} >
                    {item._id}
                  </td>
                  <td className={`${tdClass} cursor-pointer`}>
                    <button className="" onClick={() => handleOrderDetail(item._id)}>
                      <AiOutlineEye size={24} className="text-gray-700 hover:text-[#386572] transition" />
                    </button>
                  </td>

                  <td className={tdClass}>{item.paymentStatus}</td>
                  <td className={tdClass}>{item.totalAmount.toLocaleString()} đ</td>
                  <td className={tdClass}>{item.paymentMethod}</td>
                  <td className={`${tdClass}`}>
                    <button className={`px-3 py-2 rounded text-white
                       ${item.status === 'pending' ? 'bg-yellow-400 ' :
                        item.status === 'confirmed' ? 'bg-blue-400 ' :
                          item.status === 'completed' ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className={tdClass}>  {new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                  <td className={tdClass}>
                    <button
                      className=" flex items-center px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer">
                      <FaTrash className="mr-1" /> Xóa
                    </button></td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>


      {/* Pagination */}
      <div className="py-8 flex justify-center">
        <Pagination
          current={currentPage}
          total={pagination.total || 0}
          pageSize={pagination.limit || 20}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};
