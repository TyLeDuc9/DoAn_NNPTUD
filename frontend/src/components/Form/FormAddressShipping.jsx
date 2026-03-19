import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../redux/ShippingAddress/apiShippingAddress";

export const FormAddressShipping = () => {
  const dispatch = useDispatch();
  const { addresses = [], isFetching } = useSelector(
    (state) => state.shippingAddress
  );
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    is_default: false,
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchAddresses(currentUser._id));
    }
  }, [dispatch, currentUser?._id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser?._id) return alert("Vui lòng đăng nhập trước!");

    const payload = { ...formData, userId: currentUser._id };
    if (editingId) dispatch(updateAddress(editingId, payload));
    else dispatch(addAddress(payload));

    setFormData({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      is_default: false,
    });
    setEditingId(null);
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditingId(addr._id);
  };

  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
  };

  const handleSetDefault = (id) => {
    if (!currentUser?._id) return;
    dispatch(setDefaultAddress(id, currentUser._id));
  };

  return (
    <div className="w-full my-4">
      <h2 className="lg:text-lg text-base font-medium text-gray-500 mb-4">
        {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ giao hàng mới"}
      </h2>

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {[
          { key: "fullName", placeholder: "Họ và tên" },
          { key: "phone", placeholder: "Số điện thoại" },
          { key: "address", placeholder: "Địa chỉ cụ thể" },
          { key: "city", placeholder: "Tỉnh / Thành phố" },
          { key: "district", placeholder: "Quận / Huyện" },
          { key: "ward", placeholder: "Phường / Xã" },
        ].map((f) => (
          <div key={f.key} className={f.key === "address" ? "col-span-2" : ""}>
            <input
              type="text"
              name={f.key}
              value={formData[f.key] || ""}
              onChange={handleChange}
              required
              placeholder={f.placeholder}
              className="w-full border border-gray-300 rounded-lg 
              px-3 py-2 text-base focus:outline-none focus:border-blue-500 placeholder-gray-400"
            />
          </div>
        ))}

        <div className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="is_default"
            checked={formData.is_default}
            onChange={handleChange}
            className=" w-3 h-3 accent-blue-600"
          />
          <span className="text-gray-700 text-sm">Đặt làm mặc định</span>
        </div>

        <button
          type="submit"
          disabled={isFetching}
          className="col-span-2 cursor-pointer bg-[#4c8696] 
          hover:bg-[#639eae] text-white font-semibold lg:py-2 py-1.5 text-sm lg:text-base lg:rounded-lg rounded-sm transition"
        >
          {editingId ? "Cập nhật" : "Lưu địa chỉ"}
        </button>
      </form>

      {/* ===== DANH SÁCH ===== */}
      <div className="lg:mt-8 mt-4">
        <h3 className="lg:text-lg text-base  font-medium text-gray-500 mb-2">Địa chỉ của bạn</h3>
        {addresses.length === 0 ? (
          <p className="text-gray-500">Chưa có địa chỉ nào.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`p-4 border rounded-lg ${
                  addr.is_default
                    ? "border-[#639eae] bg-[#eaf2f5]"
                    : "border-green-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold lg:text-base text-sm">{addr.fullName}</p>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                    <p className="text-sm text-gray-600 my-0.5">
                      {addr.address}, {addr.district}, {addr.city}
                    </p>
                    {addr.is_default && (
                      <span className="text-xs bg-[#4c8696] text-white px-2 py-1 rounded-md">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="flex lg:flex-row flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(addr)}
                      className="px-3 py-1 border text-yellow-500 lg:text-base text-sm rounded-md hover:bg-yellow-50 cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(addr._id)}
                      className="lg:px-3 lg:py-1 px-2 py-0.5 border lg:text-base text-sm rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Xóa
                    </button>
                    {!addr.is_default && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr._id)}
                        className="lg:px-3 lg:py-1 px-2 py-0.5 border rounded-md  lg:text-base text-sm 
                        text-blue-600 hover:bg-blue-50 cursor-pointer"
                      >
                        Mặc định
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
