import React, {useEffect} from 'react';
import { useCategoryBook } from '../../hooks/useCategoryBook';
import { sliderSettings } from '../../utils/sliderSettings';
import Slider from 'react-slick';
import { BookCard } from '../BookCard/BookCard';
import { ViewAll } from '../ViewAll/ViewAll';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const CategoryBook = ({ id, slug }) => {
  const { categoryBook, loading, err } = useCategoryBook(id, slug);
  const { setComponentsLoading } = useLoading();

  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);
  if (loading) return <ComponentLoading />;
  if (err) return <p>Có lỗi xảy ra khi tải</p>;

  return (
    <div className="w-[89%] mx-auto lg:my-8 my-4">
      <ViewAll id={id} slug={slug} />

      <Slider {...sliderSettings}>
        {categoryBook.map((item) => (
          <div key={item.id}>
            <BookCard book={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
};
