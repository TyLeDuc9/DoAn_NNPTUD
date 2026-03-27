import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Title } from "../../components/Title/Title";
import { QuantityControl } from "../../components/QuantityControl/QuantityControl";
import { CartModal } from "../../components/CartModal/CartModal";
import { addToCart } from "../../redux/Cart/apiCart";
import { Favorite } from "../../components/Favorite/Favorite";
import { Rating } from '../../components/Rating/Rating'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const BookDetailInformation = ({ book }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const volumeParam = params.get("volume");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    if (book?.details?.length) {
      const detail =
        volumeParam && book.details.some((d) => d.volume !== undefined)
          ? book.details.find((d) => String(d.volume) === String(volumeParam))
          : book.details[0];
      setSelectedDetail(detail);
    }
  }, [book, volumeParam]);

  if (!book) return <p>Đang tải...</p>;

  const handleSelectVolume = (detail) => {
    setSelectedDetail(detail);
    const newParams = new URLSearchParams(location.search);
    newParams.set("volume", detail.volume);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };



  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    if (!selectedDetail) return;

    const item = {
      bookdetailId: selectedDetail._id,
      quantity,
    };
    await addToCart(dispatch, item);
    setIsModalOpen(true);
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    if (!selectedDetail) return;

    const item = {
      bookdetailId: selectedDetail._id,
      quantity,
    };
    await addToCart(dispatch, item);
    navigate('/checkout-step-one')
  }


  const hasDiscount = selectedDetail?.discountValue > 0;
  const displayPrice = hasDiscount
    ? selectedDetail.discountedPrice || selectedDetail.price
    : selectedDetail?.price;

  return (
    <div className="space-y-2 lg:ml-8">
      <Title
        title={book.name}
        className="uppercase font-medium lg:text-[22px] text-lg mt-2 lg:mt-0 text-[#2d525c] pr-8"
      />
      <div className="flex justify-between lg:py-2 py-1">
        <Rating bookId={book._id} />
        <Favorite userId={currentUser?._id || currentUser?.id} bookDetailId={selectedDetail?._id} />
      </div>

      {/* Chọn tập nếu có nhiều tập */}
      {book.details && book.details.length > 1 ? (
        // --- Có nhiều tập ---
        <div className="flex lg:flex-row flex-col lg:items-center gap-2 my-2">
          <p className="font-semibold lg:text-base text-sm">Chọn tập:</p>
          <div className="grid lg:grid-cols-9 sm:grid-cols-9 grid-cols-5 gap-1">
            {book.details.map((d, index) => (
              <button
                key={index}
                onClick={() => handleSelectVolume(d)}
                className={`px-1 py-2 lg:px-2 lg:py-1 lg:text-sm text-xs rounded border border-cyan-500 cursor-pointer
            ${selectedDetail?._id === d._id ? "text-rose-600" : ""}`}
              >
                Tập {d.volume}
              </button>
            ))}
          </div>
        </div>
      ) : book.details && book.details.length === 1 && book.details[0].volume ? (
        // --- Chỉ có 1 tập ---
        <div className="my-2">
          <span className="font-semibold">Tập:</span>{" "}
          <span className="px-2.5 py-1 text-sm rounded border border-cyan-500 cursor-pointer">{book.details[0].volume}</span>
        </div>
      ) : (
        // --- Không có tập (sách 1 quyển duy nhất) ---
        <div>
        </div>
      )}

      {/* Thông tin cơ bản */}
      <div>
        <ul className="flex space-x-4 my-4 lg:text-sm sm:text-sm text-xs">
          <li className="pr-2 border-r-2 border-b-cyan-800">
            <span>Thương hiệu:</span>{" "}
            <Link
              to={`/nha-xuat-ban/${book.publisher_id?._id}/${book.publisher_id?.slug}?page=1`}
            >
              <span className="font-medium text-[#639eae] hover:opacity-70">
                {book.publisher_id?.name}
              </span>
            </Link>
          </li>
          <li className="pr-2  border-b-cyan-800">
            <span>Loại:</span>{" "}
            {book.category_id?.map((c) => (
              <Link key={c._id} to={`/danh-muc/${c._id}/${c.slug}`}>
                <span className="font-medium capitalize text-[#4f8392] hover:opacity-70">
                  {c.name}{", "}
                </span>
              </Link>
            ))}
          </li>
        </ul>
      </div>

      {/* Giá */}
      {selectedDetail && (
        <div className="flex items-center gap-2">
          <p className="text-red-400 lg:text-3xl sm:text-2xl text-xl font-semibold">
            {Number(displayPrice).toLocaleString("vi-VN")} ₫
          </p>
          {hasDiscount && (
            <>
              <p className="text-gray-500 font-semibold text-lg mt-2 line-through px-4">
                {Number(selectedDetail.price).toLocaleString("vi-VN")} ₫
              </p>
              <span className="mt-2 text-gray-500 font-medium text-sm">
                (Bạn đã tiết kiệm {Number(selectedDetail.price - displayPrice).toLocaleString('vi-VN')}₫)
              </span>
            </>
          )}
        </div>
      )}

      {/* Số lượng + nút */}
      <div className="items-center">
        <span className="lg:text-sm text-xs font-semibold text-[#253337]">
          Số lượng: {selectedDetail?.stock_quantity}
        </span>
      </div>
      <div className="flex flex-col-reverse lg:flex-col gap-4">
        <div className="flex lg:flex-row flex-col">
          <QuantityControl
            min={1}
            max={selectedDetail?.stock_quantity || 10}
            value={quantity}
            onChange={(val) => setQuantity(val)}
          />
          <button
            onClick={handleAddToCart}
            className="lg:px-4 lg:py-2 px-2 py-2 bg-[#364e57] text-white lg:my-0 my-4
           rounded-sm lg:mx-4 cursor-pointer font-extralight lg:text-base text-sm"
          >
            Thêm vào giỏ hàng
          </button>
          <button
            onClick={handleBuyNow}
            className="lg:px-4 lg:py-2 px-2 py-2 bg-[#364e57] text-white 
          rounded-sm cursor-pointer font-extralight lg:text-base text-sm"
          >
            Mua ngay
          </button>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <span className="font-medium text-base">Thông tin sản phẩm</span>
          <ul className="space-y-1 text-base my-2 font-stretch-50%">
            <li>
              <span>Mã ISBN:</span> {selectedDetail?.isbn}
            </li>
            <li>
              <span>Tác giả: </span>
              <span className="font-medium text-red-500">
                {book.author_id?.map((a) => a.name).join(", ")}
              </span>
            </li>
            {book.details?.length > 1 && (
              <li>
                <span>Tập: </span>
                <span className="text-red-500">{selectedDetail?.volume}</span>
              </li>
            )}
            <li>
              <span>Ngôn ngữ: </span> {selectedDetail?.language}
            </li>
            <li>
              <span>Khuôn khổ: </span> {selectedDetail?.dimensions}
            </li>
            <li>
              <span>Số trang: </span> {selectedDetail?.pages}
            </li>
            <li>
              <span>Trọng lượng: </span> {selectedDetail?.weight} gram
            </li>
            <li>
              <span>Năm xuất bản: </span> {selectedDetail?.publication_year}
            </li>
            <li>
              <span>Hình thức: </span> {selectedDetail?.cover_type}
            </li>
            <li>
              <span>Tái bản: </span> {selectedDetail?.edition}
            </li>
          </ul>
        </div>
      </div>
      {/* Modal giỏ hàng */}
      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ToastContainer position="top-right" autoClose={3000} toastStyle={{
        fontSize: window.innerWidth < 768 ? '12px' : '16px',
        minWidth: window.innerWidth < 768 ? '10px' : '50px',
      }} />
    </div>
  );
};
