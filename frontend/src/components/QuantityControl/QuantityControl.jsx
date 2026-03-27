import React, { useState } from "react";
import { Button, InputNumber } from "antd";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

export const QuantityControl = ({ min = 1, max = 99, defaultValue = 1, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handleDecrease = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleInputChange = (val) => {
    if (val >= min && val <= max) {
      setValue(val);
      onChange?.(val);
    }
  };

  return (
    <div className="flex items-center">
      {/* Nút giảm */}
      <Button
        type="default"
        onClick={handleDecrease}
        disabled={value <= min}
        style={{
          width: 32,
          height: 35,
          borderRadius: 0,
          borderRight: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AiOutlineMinus className="text-base text-[#386673] font-bold" />
      </Button>

      <InputNumber
        value={value}
        min={min}
        max={max}
        onChange={handleInputChange}
        controls={false} // 🚀 Tắt mũi tên tăng giảm mặc định
        style={{
          width: 60,
          height: 35,
          textAlign: "center",
          borderRadius: 0,
        }}
      />

      {/* Nút tăng */}
      <Button
        type="default"
        onClick={handleIncrease}
        disabled={value >= max}
        style={{
          width: 32,
          height: 35,
          borderRadius: 0,
          borderLeft: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AiOutlinePlus className="text-base text-[#386673] font-bold" />
      </Button>
    </div>
  );
};
