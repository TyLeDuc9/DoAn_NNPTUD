import React, { useEffect, useState } from "react";
import { Title } from "../../components/Title/Title";
import { useParams, useNavigate } from "react-router-dom";
import { getPublisherById, updatePublisher } from "../../services/publisherApi";

export const EditPublisher = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        image: null,
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPublisherById(id);
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    image: null,
                });
                setPreviewImage(data.image);


            } catch (err) {

                console.log(err);
            }
        };
        fetchData();
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePublisher(id, formData);
            navigate("/admin/publisher?page=1");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-xl">
                <Title title="Chỉnh sửa thông tin NXB" className="text-xl mb-6 text-center" />
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between">
                        <label className="w-1/4 text-[#3a606e] font-medium">Tên NXB</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="w-1/4 text-[#3a606e] font-medium">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="w-1/4 text-[#3a606e] font-medium">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="w-1/4 text-[#3a606e] font-medium">Địa chỉ</label>
                        <textarea
                            rows={4}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-3/4 border px-4 py-2 rounded-lg resize-none"
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="w-1/4 text-[#3a606e] font-medium">Hình ảnh</label>
                        <div className="w-3/4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="border px-4 py-2 rounded-lg w-full"
                            />
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="preview"
                                    className="mt-3 w-full h-32 object-contain rounded-lg"
                                />
                            )}
                        </div>
                    </div>

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
};
