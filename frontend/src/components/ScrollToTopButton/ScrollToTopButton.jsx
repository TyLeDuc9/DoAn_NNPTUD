import { HiArrowUp } from "react-icons/hi";
import React, { useEffect, useState } from "react";
export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", check);
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    visible && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-8 h-8 cursor-pointer
                   bg-[#386572]/70 text-white rounded-full 
                   flex items-center justify-center
                   hover:bg-[#4d8898] shadow-lg z-50"
      >
        <HiArrowUp className="text-lg" />
      </button>
    )
  );
};
