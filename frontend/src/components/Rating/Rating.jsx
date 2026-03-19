import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createRating,
  fetchRatingsByBook,
} from "../../redux/Rating/apiRating";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const Rating = ({ bookId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const { ratings, loading } = useSelector((state) => state.rating);

  const [hover, setHover] = useState(null);
  const [userRating, setUserRating] = useState(0);

  // 🟢 Khi bookId thay đổi, reset userRating và fetch rating mới
  useEffect(() => {
    setUserRating(0);
    setHover(null);
    if (bookId) {
      dispatch(fetchRatingsByBook(bookId));
    }
  }, [bookId, dispatch]);

  // 🟢 Cập nhật userRating khi ratings hoặc currentUser thay đổi
  useEffect(() => {
    if (ratings?.length && currentUser) {
      const existing = ratings.find(
        (r) =>
          (r.userId?._id || r.userId) ===
          (currentUser._id || currentUser.id)
      );
      setUserRating(existing ? existing.rating : 0);
    } else {
      setUserRating(0);
    }
  }, [ratings, currentUser]);

  // 🟢 Xử lý click đánh giá
  const handleRating = async (value) => {
    if (!currentUser) {
      toast.error("⚠️ Vui lòng đăng nhập để đánh giá sách!");
      return;
    }
    // Click lại sao hiện tại → xóa rating
    const newRating = userRating === value ? 0 : value;
    setUserRating(newRating); // update UI ngay
    await dispatch(
      createRating(currentUser._id || currentUser.id, bookId, newRating)
    );
  };
  // 🟢 Tính rating trung bình
  const avgRating =
    ratings?.length > 0
      ? (
        ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
        ratings.length
      ).toFixed(1)
      : 0;

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => (
        <FaStar
          key={value}
          onClick={() => handleRating(value)}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(null)}
          className={`cursor-pointer lg:text-lg text-base transition-transform duration-150 ${value <= (hover || userRating)
              ? "text-yellow-400 scale-110"
              : "text-gray-300"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        />
      ))}

      <span className="lg:ml-2 lg:text-sm text-xs text-gray-700">
        {avgRating} ⭐ ({ratings?.length || 0} lượt)
      </span>
      <ToastContainer position="top-right" autoClose={3000} toastStyle={{
        fontSize: window.innerWidth < 768 ? '12px' : '16px',
        minWidth: window.innerWidth < 768 ? '10px' : '50px',
      }} />
    </div>
  );
};
