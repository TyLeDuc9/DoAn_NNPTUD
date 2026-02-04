import React, { useState } from "react";
import blogUs from "../../data/blog";
import aboutUs from "../../data/aboutUs";

export const Introduce = () => {
  const [activeIndex, setActiveIndex] = useState(0);



  return (
    <div>
  
      <div className="relative w-full lg:h-[700px] h-[500px] overflow-hidden bg-[#fffaf4]">
        <img
          src={blogUs[activeIndex].img}
          alt={blogUs[activeIndex].title}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute lg:top-1/2 sm:top-1/2 sm:left-10 top-31 lg:left-10 left-12 transform -translate-y-1/2 
        bg-[#fff9f1]/50 lg:w-[300px] sm:w-[300px] sm:h-[300px] lg:h-[350px] w-[300px] h-[180px] p-8 shadow-xl rounded-xl transition-all duration-500">
          <h3 className="lg:text-3xl sm:text-2xl text-base text-white font-bold playfair-display lg:my-6">{blogUs[activeIndex].title}</h3>
          <p className="lg:text-lg sm:text-base text-sm py-6 text-white font-semibold">{blogUs[activeIndex].content}</p>
        </div>

        <div className="absolute right-20 lg:bottom-60 sm:bottom-40 bottom-20 flex flex-col lg:gap-5 sm:gap-5 gap-3">
          {blogUs.map((item, index) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveIndex(index)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span
                className={` lg:text-5xl sm:text-3xl text-2xl font-medium transition-all duration-300 ${index === activeIndex
                  ? "text-white/95 italic"
                  : "text-white/30"
                  }`}
              >
                {item.id}
              </span>
              <div className="relative w-[160px]">
                <div
                  className={`absolute right-0 h-1 transition-all duration-500 
                                    ${index === activeIndex ?
                      "w-[160px] bg-yellow-300" :
                      "w-[80px] bg-white/40"
                    }`}
                ></div>
              </div>
              <div
                className={`w-2 h-2 rounded-full border-2 origin-right transition-all duration-300 
                                ${index === activeIndex
                    ? "border-white bg-yellow-300 scale-110"
                    : "border-white/50 "
                  }`}
              ></div>
            </div>
          ))}
        </div>

        <p className="absolute text-[#fff9f1]/90 bottom-10 lg:right-20 right-10 font-bold lg:text-4xl text-lg uppercase italic">
          Vì sao BookNest được tin chọn?
        </p>
      </div>



      <div className="w-[90%] mx-auto py-10">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 w-full bg-[#fff9f1] flex flex-col lg:h-[90vh] sm:h-[30vh] h-[60vh] rounded-sm">
            {aboutUs.map((item, index) => (
              <div key={index} className="lg:my-24 lg:ml-16">
                <p className="lg:text-3xl text-xl font-semibold playfair-display gl:mb-4 lg:mx-16 mx-4 mt-4 lg:mt-0">
                  {item.title}
                </p>
                <div className="flex lg:mx-16 lg:mt-16 mx-4 mt-6">
                  <div className="w-2 bg-yellow-400 rounded-full mr-4"></div>
                  <p className="leading-relaxed lg:text-base text-sm text-gray-700 text-justify whitespace-pre-line ">
                    {item.content}
                  </p>
                </div>

              </div>
            ))}

          </div>

          <div className="lg:w-2/5 w-full flex items-center justify-center">
            {aboutUs.map((item, index) => (
              <img
                key={index}
                src={item.img}
                alt={item.title}
                className="w-full lg:h-[90vh] h-[50vh] object-cover rounded-sm shadow-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
