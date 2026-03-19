import React, { useState, useEffect } from 'react';
import { Title } from "../../components/Title/Title";
import { useNavigate, useParams } from 'react-router-dom';
import { adminUpdateAddress, getAddressById } from '../../services/shippingAddressApi'
export const EditAddressShipping = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    // Khởi tạo state từ addressData nếu có
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
    });

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await getAddressById(id)
                if (res.success && res.address) {
                    setForm({
                        fullName: res.address.fullName || "",
                        phone: res.address.phone || "",
                        address: res.address.address || "",
                        city: res.address.city || "",
                        district: res.address.district || "",
                        ward: res.address.ward || "",
                    })
                } else {
                    alert("Không tìm thấy địa chỉ giao hàng!");
                    navigate("/admin/shipping-address?page=1&sort=newest");
                }
            } catch (err) {
                console.log(err);
                alert("Lỗi khi lấy dữ liệu địa chỉ!");
            } finally {
                setLoading(false);
            }
        }
        fetchAddress()
    }, [id, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminUpdateAddress(id, form)
            alert("Cập nhật thành công!");
            navigate("/admin/shipping-address?page=1&sort=newest");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi cập nhật địa chỉ giao hàng!");
        }
    };

    const fields = [
        { label: "Họ và tên", name: "fullName", type: "text" },
        { label: "Số điện thoại", name: "phone", type: "text" },
        { label: "Địa chỉ", name: "address", type: "text" },
        { label: "Thành phố", name: "city", type: "text" },
        { label: "Quận/huyện", name: "district", type: "text" },
        { label: "Phường/xã", name: "ward", type: "text" }
    ];
    if (loading) {
        return <div className="text-center pt-16">Đang tải dữ liệu...</div>;
    }
    return (
        <div className="flex justify-center items-center pt-16">
            <div className="p-8 rounded-xl shadow-sm w-full max-w-4xl bg-gray-50">
                <Title
                    title="Cập nhật địa chỉ giao hàng"
                    className="text-center pb-6 text-2xl font-semibold"
                />
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className="flex items-center gap-4">
                            <label className="font-medium w-40 text-[#3a606e]">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={form[field.name] || ""}
                                onChange={handleChange}
                                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                                required={field.name !== "description"}
                            />
                        </div>
                    ))}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#386572] text-white font-semibold transition cursor-pointer"
                        >
                            Cập nhật
                        </button>
                        <button
                            onClick={() => navigate("/admin/shipping-address?page=1&sort=newest")}
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 ml-4 text-white cursor-pointer font-semibold transition"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
