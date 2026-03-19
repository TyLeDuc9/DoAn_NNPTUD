import React, { useState, useEffect } from "react";
import { useAllCart } from "../../hooks/useAllCart";
import {deleteCartId} from '../../services/cartApi'
import { Title } from "../../components/Title/Title";
import { SearchAdmin } from "../../components/SearchAdmin/SearchAdmin";
import { Pagination } from "antd";
import { FaTrash } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { Modal } from "antd";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { useLoading } from '../../context/LoadingContext';
export const CartAdmin = () => {
  const { setComponentsLoading } = useLoading();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sort, setSort] = useState("newest");

  const { data, pagination, loading, error } = useAllCart(currentPage, 20, sort);

  // Update URL
  useEffect(() => {
    setComponentsLoading(loading)
    setSearchParams({ page: currentPage, sort });
  }, [currentPage, sort, loading]);

  const handleDeleteCartId =async (id) => {
    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa giỏ hàng này không?`)
    if (!confirmDelete) return
    try {
      await deleteCartId(id)
      alert("Xóa thành công!");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }


  if (loading) return <ComponentLoading />;
  if (error) return <div className="p-6 text-center text-red-500">Lỗi: {error}</div>;

  const tdClass = "border p-2 border-gray-400"
  const thClass = "border border-gray-200 p-2";
  return (
    <div className="px-4 bg-white">
      <Title title="Quản lý giỏ hàng" className="text-center text-3xl py-8 font-bold text-[#3a606e]" />
      <SearchAdmin />

      {/* SORT */}
      <div className="flex items-center justify-between my-8">
        <h2 className="text-lg font-medium">Danh sách giỏ hàng</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-1 ml-6 rounded"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="border-collapse  w-full">
          <thead className="bg-[#386572] text-white text-center">
            <tr>
              <th className={thClass}>STT</th>
              <th className={thClass}>Tên</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Sách</th>
              <th className={thClass}>Hình ảnh</th>
              <th className={thClass}>BìaTập</th>
              <th className={thClass}>Tập</th>
              <th className={thClass}>Đơn giá</th>
              <th className={thClass}>SL</th>
              <th className={thClass}>Trạng thái</th>
              <th className={thClass}>Tổng SL giỏ</th>
              <th className={thClass}>Tổng tiền giỏ</th>
              <th className={thClass}>Ngày tạo</th>
              <th className={thClass}>Xóa</th>
            </tr>
          </thead>

          <tbody>
            {data.map((cart, cartIdx) => {
              const rowSpan = cart.items.length;

              return cart.items.map((item, idx) => (
                <tr key={item._id} className="text-center hover:bg-[#639eae]/80 hover:text-white transition">

                  {/* STT + User + Email: chỉ 1 lần */}
                  {idx === 0 && (
                    <>
                      <td rowSpan={rowSpan} className={tdClass}>
                        {(currentPage - 1) * pagination.limit + (cartIdx + 1)}
                      </td>

                      <td rowSpan={rowSpan} className={tdClass}>
                        {cart.user_id.name}
                      </td>

                      <td rowSpan={rowSpan} className={tdClass}>
                        {cart.user_id.email}
                      </td>
                    </>
                  )}

                  {/* Sách */}
                  <td className={tdClass}>{item.bookdetail_id.book_id.name}</td>


                  <td className={tdClass}>
                    <img
                      onClick={() => setPreviewImage(item.bookdetail_id.images[0])}
                      src={item.bookdetail_id.images[0]}
                      className="w-14 h-20 object-cover mx-auto"
                    />
                  </td>
                  <td className={tdClass}>{item.bookdetail_id.cover_type}</td>
                  <td className={tdClass}>{item.bookdetail_id.volume || "x"}</td>
                  <td className={tdClass}>{item.price.toLocaleString()}đ</td>
                  <td className={tdClass}>{item.quantity}</td>

                  {/* Chỉ hiển thị 1 lần */}
                  {idx === 0 && (
                    <>
                      <td rowSpan={rowSpan} className={tdClass}>
                        <button
                          className={`w-16 h-10 flex items-center justify-center px-3 py-2 rounded text-white
      ${cart.status === 'active' ? 'bg-red-400' :
                              cart.status === 'ordered' ? 'bg-green-400' :
                                'bg-yellow-400'}
    `}
                        >
                          {cart.status}
                        </button>
                      </td>
                      <td rowSpan={rowSpan} className={tdClass}>{cart.totalQuantity}</td>
                      <td rowSpan={rowSpan} className={tdClass}>
                        {cart.totalPrice.toLocaleString()}đ
                      </td>
                      <td rowSpan={rowSpan} className={tdClass}>
                        {new Date(cart.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="border p-2 text-center border-gray-400" rowSpan={rowSpan} >
                        <div className='flex justify-center'>
                          <button
                            onClick={() => handleDeleteCartId(cart._id)}
                            className=" flex items-center px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer">
                            <FaTrash className="mr-1" /> Xóa
                          </button>
                        </div>
                      </td>

                    </>
                  )}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center py-8">
        <Pagination
          current={pagination.page}
          pageSize={pagination.limit}
          total={pagination.total}
          onChange={(page) => setCurrentPage(page)}
        />
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
