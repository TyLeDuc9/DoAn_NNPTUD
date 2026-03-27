import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Title } from "../../components/Title/Title";
import { getDiscountById, updateDiscount } from "../../services/discountApi";

export const EditDiscount = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    value: 0,
    isActive: false,
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Lấy dữ liệu discount theo ID
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const data = await getDiscountById(id);
        // Chuyển đổi dữ liệu ngày thành dạng yyyy-MM-dd để hiển thị trong input[type=date]
        setForm({
          ...data,
          startDate: data.startDate ? data.startDate.slice(0, 10) : "",
          endDate: data.endDate ? data.endDate.slice(0, 10) : "",
        });
      } catch (err) {
        console.error("Error fetching discount:", err);
        alert("Không tìm thấy mã giảm giá!");
        navigate("/admin/discount");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscount();
  }, [id, navigate]);

  // ✅ Cập nhật giá trị form khi người dùng nhập
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDiscount(id, form);
      alert("Cập nhật thành công!");
      navigate("/admin/discount");
    } catch (err) {
      console.error("Error updating discount:", err);
      alert("Lỗi khi cập nhật mã giảm giá!");
    }
  };

  if (loading) {
    return <div className="text-center pt-16">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="flex justify-center items-center pt-16">
      <div className="p-8 rounded-xl shadow-sm w-full max-w-4xl bg-gray-50">
        <Title
          title="Cập nhật mã giảm giá"
          className="text-center pb-6 text-2xl font-semibold"
        />
        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            { label: "Tiêu đề", name: "title", type: "text" },
            { label: "Mô tả", name: "description", type: "text" },
            { label: "Giá trị", name: "value", type: "number" },
            {
              label: "Loại giảm giá",
              name: "discountType",
              type: "select",
              options: [
                { label: "Giảm theo %", value: "percentage" },
                { label: "Giảm số tiền", value: "fixed" },
              ],
            },
            { label: "Hoạt động", name: "isActive", type: "checkbox" },
            { label: "Ngày bắt đầu", name: "startDate", type: "date" },
            { label: "Ngày kết thúc", name: "endDate", type: "date" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="font-medium mb-1">{field.label}</label>

              {["text", "number", "date"].includes(field.type) && (
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                  required={field.name !== "description"}
                />
              )}

              {field.type === "select" && (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-[#3a606e]"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <input
                  type="checkbox"
                  name={field.name}
                  checked={form[field.name]}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
              )}
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
              onClick={() => navigate("/admin/discount")}
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
