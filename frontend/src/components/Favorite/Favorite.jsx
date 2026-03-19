import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  addToFavorite,
  removeFromFavorite,
  checkIsFavorite,
} from "../../redux/Favorite/apiFavorite";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const Favorite = ({ userId, bookDetailId }) => {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!userId || !bookDetailId) return;

    const fetchFavoriteStatus = async () => {
      try {
        const isFav = await checkIsFavorite(userId, bookDetailId);
        setLiked(isFav);
      } catch (err) {
        console.error("❌ Lỗi kiểm tra yêu thích:", err);
      }
    };

    fetchFavoriteStatus();
  }, [userId, bookDetailId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để thêm yêu thích");
      return;
    }

    try {
      if (liked) {
        await dispatch(removeFromFavorite(userId, bookDetailId));
        setLiked(false);
      } else {
        await dispatch(addToFavorite(userId, { _id: bookDetailId }));
        setLiked(true);
      }
    } catch (err) {
      console.error("❌ Lỗi cập nhật yêu thích:", err);
    }
  };

  return (
    <div className="cursor-pointer flex items-center" onClick={handleClick}>
      <FaHeart
        className={`${liked ? "text-red-500" : "text-gray-300"
          } lg:text-lg text-base transition-colors duration-200`}
      />
      <ToastContainer position="top-right" autoClose={3000} toastStyle={{
        fontSize: window.innerWidth < 768 ? '12px' : '16px',
        minWidth: window.innerWidth < 768 ? '10px' : '50px',
      }} />
    </div>
  );
};
