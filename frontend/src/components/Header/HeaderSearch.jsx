import React, { useState } from "react";
import { Button } from "../Button/Button";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SearchModal } from "../SearchModal/SearchModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const HeaderSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error("Vui lòng nhập từ khóa!");
      return;
    }
    navigate(`/tim-kiem?q=${encodeURIComponent(keyword.trim())}`);
    setIsOpen(false);
  };

  return (
    <div className="relative lg:w-full lg:max-w-md">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tìm kiếm sách..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full border border-[#4a7885] lg:px-4 sm:py-2 sm:px-4 lg:py-2 px-2.5 py-1.5 lg:pr-12
          shadow-2xl focus:border-white focus:ring-0 focus:ring-white outline-none transition lg:text-sm sm:text-sm text-base"
        />
        <Button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2  text-white p-2 
          shadow-md transition cursor-pointer hover:opacity-75"
        >
          <FaSearch className="text-xs" />
        </Button>
      </form>

      {isOpen && keyword && (
        <SearchModal onClose={() => setIsOpen(false)} keyword={keyword} />
      )}
      <ToastContainer position="top-right" autoClose={3000} toastStyle={{
        fontSize: window.innerWidth < 768 ? '12px' : '16px',
        minWidth: window.innerWidth < 768 ? '10px' : '50px',
      }} />
    </div>
  );
};
