import React, { useEffect, useState } from "react";
import { Title } from "../Title/Title";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import {
  fetchCommentsByBook,
  createComment,
  updateComment,
  deleteComment,
} from "../../redux/Comment/apiCommnet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const Comments = ({ bookId }) => {
  const dispatch = useDispatch();
  const { comments = [], loading } = useSelector((state) => state.comment);
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const { setComponentsLoading } = useLoading();
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false); // ✅ Ẩn danh
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách bình luận khi bookId thay đổi
  useEffect(() => {
    if (bookId) {
      dispatch(fetchCommentsByBook(bookId));
    }
  }, [bookId, dispatch]);

  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error("Vui lòng đăng nhập để bình luận!");
    if (!text.trim()) return;

    if (editingId) {
      // <-- Thay thế đoạn này
      await dispatch(updateComment(editingId, {
        description: text,
        isAnonymous
      }));
      setEditingId(null);
    } else {
      const newComment = {
        bookId,
        description: text.trim(),
        isAnonymous,
      };
      await dispatch(createComment(newComment));
    }

    setText("");
    setIsAnonymous(false);
    dispatch(fetchCommentsByBook(bookId));
  };

  // Bật chế độ chỉnh sửa
  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setText(comment.description);
    setIsAnonymous(comment.isAnonymous); // hiển thị đúng trạng thái ẩn danh khi chỉnh sửa
  };

  // Xóa bình luận
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      await dispatch(deleteComment(id));
      dispatch(fetchCommentsByBook(bookId));
    }
  };

  if (loading) return <ComponentLoading />;

  return (
    <div className="py-4">
      <Title
        title="Viết đánh giá sản phẩm"
        className="text-center lg:text-xl text-sm lg:pb-4 font-medium uppercase text-[#639eae]"
      />

      {/* Form bình luận */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4 mb-6 p-4 bg-white rounded-sm shadow-xs"
      >
        {/* Textarea */}
        <textarea
          rows="4"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={editingId ? "Chỉnh sửa bình luận của bạn..." : "Nhập nội dung bình luận..."}
          className="w-full text-base   border border-gray-300 rounded-xl p-4 
          text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#639eae] focus:border-transparent resize-none transition-all"
        />

        {/* Checkbox ẩn danh */}
        <div className="flex  justify-between px-1">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only text-base"
            />
            {/* Nền switch */}
            <div
              className={`lg:w-8 lg:h-4 w-6 h-3 rounded-full shadow-inner transition-colors duration-300 cursor-pointer
                ${isAnonymous ? "bg-[#639eae]" : "bg-gray-300"
                }`}
            />
            {/* Nút tròn */}
            <div
              className={`absolute lg:w-4 lg:h-4 w-2.5 h-2.5 bg-white rounded-full shadow-md transform transition-transform duration-300 
                ${isAnonymous ? "translate-x-5" : "translate-x-0"
                }`}
            />
            {/* Text */}
            <span className="ml-3 text-gray-700 text-xs  select-none">Ẩn danh</span>
          </label>


          {/* Button gửi */}
          <button
            type="submit"
            className="self-end bg-[#639eae] lg:text-sm text-xs cursor-pointer text-white font-semibold lg:py-2
             lg:px-4 py-1 px-2 lg:rounded-xl rounded-lg hover:bg-[#386572] transition-colors shadow-md hover:shadow-lg"
          >
            {editingId ? "Sửa" : "Gửi"}
          </button>
        </div>
      </form>


      {/* Danh sách bình luận */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-center lg:text-base text-sm text-gray-400">Chưa có bình luận nào.</p>
        ) : (
          comments.map((c, index) => (
            <div
              key={c._id}
              className={`p-4 ${index !== comments.length - 1 ? "border-b border-gray-200" : ""}`}
            >
              <div className="flex items-start justify-between">
                {/* Thông tin người bình luận */}
                <div className="mr-8 flex flex-col">
                  <span className="font-semibold text-gray-800 lg:text-base text-sm ">
                    {c.isAnonymous ? "Ẩn danh" : c.userId?.name || "Người dùng"}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {new Date(c.createdAt).toLocaleString("vi-VN")}
                  </span>

                  {/* Chỉnh sửa / xóa bình luận */}
                  {currentUser &&
                    (currentUser._id === c.userId?._id || currentUser.id === c.userId?._id) && (
                      <div className="flex gap-2 text-xs mt-1">
                        <button
                          onClick={() => handleEdit(c)}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-red-500 cursor-pointer hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                </div>

                {/* Nội dung bình luận */}
                <div className="flex-1">
                  <p className="text-gray-700 lg:text-base text-sm leading-relaxed">{c.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
