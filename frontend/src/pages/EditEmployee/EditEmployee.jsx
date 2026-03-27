
    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { Title } from "../../components/Title/Title";
    import { getUserById, updateUser } from "../../services/userApi";
    export const EditEmployee = () => {
        const { id } = useParams();
        const navigate = useNavigate();

        const [user, setUser] = useState({
            name: "",
            email: "",
            phone: "",
            gender: "",
            birthday: ""
        });

        const [loading, setLoading] = useState(true);

        // Fetch data khi load trang
        useEffect(() => {
            const fetchUser = async () => {
                try {
                    const data = await getUserById(id);
                    setUser({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        gender: data.gender || "",
                        birthday: data.birthday ? data.birthday.substring(0, 10) : ""
                    });
                } catch (error) {
                    alert(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }, [id]);

        const handleChange = (e) => {
            setUser({ ...user, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await updateUser(id, user);
                alert("Cập nhật thành công!");
                navigate("/admin/user?page=1");
            } catch (error) {
                alert(error.message);
            }
        };

        if (loading) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-xl">
                    <Title title="Chỉnh sửa thông tin khách hàng" className="text-xl mb-6 text-center" />
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Họ tên */}
                        <div className="flex items-center justify-between">
                            <label className="w-1/4 text-[#3a606e] font-medium">Họ và tên</label>
                            <input
                                name="name"
                                type="text"
                                value={user.name}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                                className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between">
                            <label className="w-1/4 text-[#3a606e] font-medium">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={user.email}
                                disabled
                                className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                    bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="flex items-center justify-between">
                            <label className="w-1/4 text-[#3a606e] font-medium">Số điện thoại</label>
                            <input
                                name="phone"
                                type="text"
                                value={user.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                                className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                            />
                        </div>

                        {/* Giới tính */}
                        <div className="flex items-center justify-between">
                            <label className="w-1/4 text-[#3a606e] font-medium">Giới tính</label>
                            <div className="w-3/4 flex items-center gap-6">
                                {["male", "female", "other"].map((g) => (
                                    <label key={g} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={user.gender === g}
                                            onChange={handleChange}
                                        />
                                        {g === "male" ? "Nam" : g === "female" ? "Nữ" : "Khác"}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Ngày sinh */}
                        <div className="flex items-center justify-between">
                            <label className="w-1/4 text-[#3a606e] font-medium">Ngày sinh</label>
                            <input
                                name="birthday"
                                type="date"
                                value={user.birthday}
                                onChange={handleChange}
                                className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                            />
                        </div>

                        {/* Cập nhật */}
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
    }