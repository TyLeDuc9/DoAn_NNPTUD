import React, { useState } from "react";
import { Title } from "../../components/Title/Title";
import { changePassword } from "../../redux/Auth/authApi";

export const ChangePassAdmin = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Vui lòng đăng nhập lại!");
            setLoading(false);
            return;
        }

        try {
            const result = await changePassword(token, formData);
            setMessage(result.message);
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error(err);
            setMessage("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-xl">
                <Title title="Đổi mật khẩu" className="text-xl mb-6 text-center" />
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="w-full text-[#3a606e] font-medium text-base m-1">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            type="password"
                            name="oldPassword"
                            placeholder="Mật khẩu hiện tại"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className=" border border-gray-300 px-4 py-2 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#3a606e] text-base"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="w-full text-[#3a606e] font-medium text-base m-1">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Mật khẩu mới"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className=" border border-gray-300 px-4 py-2 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#3a606e] text-base"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="w-full text-[#3a606e] font-medium text-base m-1">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu mới"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className=" border border-gray-300 px-4 py-2 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#3a606e] text-base"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-[#3a606e] text-white text-base px-6 py-2 rounded-lg 
                        hover:bg-[#2b4a57] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                    </div>
                </form>

                {message && (
                    <p className="mt-4 text-center text-base text-[#3a606e]">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};
