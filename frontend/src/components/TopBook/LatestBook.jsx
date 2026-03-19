import React, { useEffect } from 'react'
import { useLatestBook } from '../../hooks/useLastestBook';
import { sliderSettings } from '../../utils/sliderSettings';
import Slider from 'react-slick';
import { BookCard } from '../BookCard/BookCard';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const LatestBook = () => {
    const { latestBook, loading, err } = useLatestBook()
    const { setComponentsLoading } = useLoading();

    useEffect(() => {
        setComponentsLoading(loading);
    }, [loading]);

    if (loading) return <ComponentLoading />;
    if (err) return <p>Có lỗi xảy ra khi tải</p>;

    return (
        <div className="w-[89%] mx-auto lg:my-8 my-4">
            <Slider {...sliderSettings}>
                {latestBook.map((item) => (
                    <div key={item.id}>
                        <BookCard book={item} />
                    </div>
                ))}
            </Slider>
        </div>
    )
}
