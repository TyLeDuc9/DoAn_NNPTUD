import React, { useState, useEffect } from "react";
import { Image } from "antd";
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

export const BookDetailImage = ({ book }) => {
  const allImages = book.details?.flatMap((item) => item.images) || [];
  const [mainImage, setMainImage] = useState(allImages[0] || null);
  useEffect(() => {
    setMainImage(allImages[0] || null);
  }, [book]);

  if (!allImages.length) return <p>Không có hình ảnh</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* Thumbnail container */}
      <div className="relative flex flex-row lg:flex-col items-center w-full lg:w-[90px]">

        {/* Scroll left - Mobile */}
        {allImages.length > 3 && (
          <button
            onClick={() =>
              document.getElementById("thumb-list")?.scrollBy({
                left: -120,
                behavior: "smooth",
              })
            }
            className="
              absolute 
              z-100
              -left-3 
              top-1/2 
              -translate-y-1/2
              bg-white/80 backdrop-blur-sm
              shadow-md 
              border border-gray-300
              w-8 h-8 
              flex items-center justify-center
              rounded-full
              active:scale-90
              hover:bg-white
              transition
              lg:hidden
            "
          >
            <LeftOutlined className="text-gray-700 text-xs" />
          </button>
        )}

        {/* Scroll Up – Laptop */}
        {allImages.length > 6 && (
          <button
            onClick={() =>
              document.getElementById("thumb-list")?.scrollBy({
                top: -120,
                behavior: "smooth",
              })
            }
            className="hidden lg:block mb-2"
          >
            <UpOutlined />
          </button>
        )}

        {/* Thumbnail list */}
        <div
          id="thumb-list"
          className="
            flex 
            flex-row lg:flex-col 
            gap-2 
            overflow-x-auto lg:overflow-y-auto 
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            max-w-full
            px-8 lg:px-0
          "
          style={{ maxHeight: "500px" }}
        >
          {allImages.map((img, index) => (
            <div key={index} className="flex-shrink-0">
              <Image
                src={img}
                width={70}
                height={110}
                style={{
                  objectFit: "cover",
                  borderRadius: 8,
                  cursor: "pointer",
                  boxShadow:
                    mainImage === img
                      ? "0 0 8px #1890ff"
                      : "0 1px 4px rgba(0,0,0,0.15)",
                  border:
                    mainImage === img
                      ? "2px solid #1890ff"
                      : "1px solid #e5e7eb",
                  transition: "all 0.3s ease",
                }}
                preview={false}
                onClick={() => setMainImage(img)}
              />
            </div>
          ))}
        </div>

        {/* Scroll Down – Laptop */}
        {allImages.length > 6 && (
          <button
            onClick={() =>
              document.getElementById("thumb-list")?.scrollBy({
                top: 120,
                behavior: "smooth",
              })
            }
            className="hidden lg:block mt-2"
          >
            <DownOutlined />
          </button>
        )}

        {/* Scroll right - Mobile */}
        {allImages.length > 3 && (
          <button
            onClick={() =>
              document.getElementById("thumb-list")?.scrollBy({
                left: 120,
                behavior: "smooth",
              })
            }
            className="
              absolute 
              -right-3 
              top-1/2 
              -translate-y-1/2
              bg-white/80 backdrop-blur-sm
              shadow-md 
              border border-gray-300
              w-8 h-8 
              flex items-center justify-center
              rounded-full
              active:scale-90
              hover:bg-white
              transition
              lg:hidden
            "
          >
            <RightOutlined className="text-gray-700 text-xs" />
          </button>
        )}

      </div>

      {/* Main Image */}
      <div className="w-full lg:w-[500px] flex justify-center items-center">
        <Image
          src={mainImage}
          width={350}
          height={450}
          className="lg:w-[400px] lg:h-[500px] w-[200px] h-[250px]"
          style={{
            objectFit: "contain",
            borderRadius: 12,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            border: "1px solid #e5e7eb",
          }}
        />
      </div>
    </div>
  );
};
