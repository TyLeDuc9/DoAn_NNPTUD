import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { Title } from '../Title/Title'
import { useRelatedBook } from '../../hooks/useRelatedBook';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const RelatedBook = () => {
    const { setComponentsLoading } = useLoading()
    const { relatedBook, loading, error } = useRelatedBook();
    useEffect(() => {
        setComponentsLoading(loading)
    }, [loading])
    if (loading) return <ComponentLoading />;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div>
            <Title
                title="Sản phẩm liên quan"
                className="text-center bg-[#386572] lg:text-ba text-sm py-2 text-white font-bold rounded-sm"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
                {relatedBook.map((book) => {

                    const firstDetail = book.details?.[0];
                    return (
                        <div
                            key={book._id}
                            className="flex flex-col items-center text-center p-2"
                        >
                            <Link
                                to={`/san-pham/${book._id}/${book.slug}?volume=${firstDetail?.volume}`}
                                className="w-full flex flex-col h-full"
                            >
                                {firstDetail?.images?.[0] && (
                                    <img
                                        src={firstDetail.images[0]}
                                        alt={book.name}
                                        className="w-48 h-36 object-contain sm:ml-16 lg:ml-0 rounded mb-2"
                                    />
                                )}

                                <h3 className="text-sm  font-medium text-[#25383d] hover:text-[#4d8898] line-clamp-2 mb-1">
                                    {book.name}
                                </h3>

                                <span className="text-red-500 text-sm font-bold mt-auto">
                                    {firstDetail?.price
                                        ? Number(firstDetail.price).toLocaleString('vi-VN') + '₫'
                                        : 'Liên hệ'}
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
