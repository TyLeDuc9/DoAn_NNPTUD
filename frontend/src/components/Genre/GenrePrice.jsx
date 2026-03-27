import React, { useState } from "react";
import { Title } from "../Title/Title";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const PRICE_RANGES = [
  { label: "Tất cả", value: "all" },
  { label: "Nhỏ hơn 100,000₫", value: "lt-100" },
  { label: "Từ 100,000₫ - 200,000₫", value: "100-200" },
  { label: "Từ 200,000₫ - 300,000₫", value: "200-300" },
  { label: "Từ 300,000₫ - 400,000₫", value: "300-400" },
  { label: "Từ 400,000₫ - 500,000₫", value: "400-500" },
  { label: "Lớn hơn 500,000₫", value: "gt-500" },
];

export const GenrePrice = ({ priceRange, setPriceRange }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);

  return (
    <div className="lg:px-6">
      <div
        className="flex bg-[#386673] rounded-xs py-2 items-center justify-between cursor-pointer duration-100 ease-in-out"
        onClick={handleShow}
      >
        <Title
          className="lg:text-base text-sm font-bold text-white pl-12"
          title="Khoảng giá"
        />
        {show ? (
          <AiOutlineMinus className="lg:text-4xl text-3xl text-white p-2 font-bold" />
        ) : (
          <AiOutlinePlus className="lg:text-4xl text-3xl text-white p-2 font-bold" />
        )}
      </div>

      {show && (
        <div className="p-2 border-l-2 border-r-2 border-b-2 border-gray-300 shadow-xs">
          <ul className="px-6 space-y-2">
            {PRICE_RANGES.map((item) => (
              <li key={item.value} className="flex items-center gap-2 font-medium text-[#515f63]">
                <input
                  type="checkbox"
                  name="priceRange" 
                  checked={priceRange === item.value}
                  onChange={() => setPriceRange(item.value)}
                  className="cursor-pointer"
                />
                <span className="text-[15px]">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
