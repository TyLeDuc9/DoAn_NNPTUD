import React, {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import {
  fetchFavoritesByUser,
  removeFromFavorite,
} from "../../redux/Favorite/apiFavorite";
import { BookCard } from "../../components/BookCard/BookCard";
export const FavoritePage = () => {
  const dispatch = useDispatch();
  const { setComponentsLoading } = useLoading();
  const { favorites, loading, error } = useSelector((state) => state.favorite);
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    if (!currentUser) return;
    const userId = currentUser?._id || currentUser?.id;

    if (userId) {
      dispatch(fetchFavoritesByUser(userId));
    }
  }, [dispatch, currentUser]);
  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);


  if (loading) return <ComponentLoading />;
  if (error) return <p>Lỗi: {error}</p>;

  const handleRemove = (bookDetailId) => {
    if (!currentUser) return;
    const userId = currentUser?._id || currentUser?.id;
    dispatch(removeFromFavorite(userId, bookDetailId));
  };

  let content;
  if (!currentUser) {
    content = <p className="text-center text-gray-600">Vui lòng đăng nhập để xem danh sách yêu thích ❤️</p>;
  } else if (!favorites || favorites.length === 0) {
    content = <p className="text-center text-gray-600">Chưa có sản phẩm nào trong danh sách yêu thích</p>;
  } else {
    content = (
      <div className="grid lg:grid-cols-5 grid-cols-2 sm:grid-cols-3 gap-4">
        {favorites.map((fav) => {
          const detail = fav.bookDetailId;
          const book = detail?.book_id;
          if (!book) return null;

          const formattedBook = {
            ...book,
            images: detail?.images,
            price: detail?.price,
            discountedPrice: detail?.finalPrice || detail?.price,
            discountValue: detail?.discount?.value || 0,
            volume: detail?.volume,
          };

          return (
            <div key={fav._id} className="relative">
              <BookCard book={formattedBook} />
              <AiOutlineClose
                className="absolute lg:top-2.5 lg:right-5 top-0 right-0 cursor-pointer text-lg lg:text-xl bg-white text-gray-500 hover:text-red-500 "
                onClick={() => handleRemove(detail._id)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white w-[85%] mx-auto my-12">
      <h2 className="lg:text-2xl text-lg font-semibold text-center mb-6 text-[#2d525c]">
        Sản phẩm yêu thích của bạn ❤️
      </h2>
      {content}
    </div>
  );
};
