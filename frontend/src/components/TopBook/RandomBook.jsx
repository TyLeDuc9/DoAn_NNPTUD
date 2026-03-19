import React, {useEffect} from 'react'
import { useRandomBook } from '../../hooks/useRandomBook';
import { sliderSettings } from '../../utils/sliderSettings';
import Slider from 'react-slick';
import { BookCard } from '../BookCard/BookCard';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const RandomBook = () => {
    const { randomBook, loading, err } = useRandomBook()
    const { setComponentsLoading } = useLoading();

    useEffect(() => {
        setComponentsLoading(loading);
    }, [loading]);

    if (loading) return <ComponentLoading />;
    if (loading) return <p>Đang tải</p>;
    if (err) return <p>Có lỗi xảy ra khi tải</p>;
    return (
        <div className="w-[89%] mx-auto lg:my-8 my-4">
            <Slider {...sliderSettings}>
                {randomBook.map((item) => (
                    <div key={item.id}>
                        <BookCard book={item} />
                    </div>
                ))}
            </Slider>
        </div>
    )
}
