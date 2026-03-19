import React, { useEffect, useState } from 'react'
import { Title } from "../../components/Title/Title";
import { GenreList } from "../../components/Genre/GenreList";
import { GenrePublisher } from "../../components/Genre/GenrePublisher";
import { useAllBookByPublisher } from '../../hooks/useAllBookByPublisher';
import { Pagination } from "antd";
import { SortBook } from "../../components/Sort/SortBook";
import { BookCard } from "../../components/BookCard/BookCard";
import { useSearchParams, useParams  } from 'react-router-dom';
import { GenrePrice } from '../../components/Genre/GenrePrice';
import { BannerPages } from '../../components/Banner/BannerPages';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const PublisherByBook = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [sort, setSort] = useState('newest')
    const { id, slug } = useParams();
    const [priceRange, setPriceRange] = useState("all");
    const pageParam = parseInt(searchParams.get("page")) || 1
    const [currentPage, setCurrentPage] = useState(pageParam)
    const { publisherByBook, error, pagination, loading, publisher } =
        useAllBookByPublisher(id,
            slug, currentPage, 20, sort, priceRange)
    const { setComponentsLoading } = useLoading()

    useEffect(() => {
        setSearchParams({ page: currentPage, sort })
    }, [currentPage, setSearchParams])

    useEffect(() => {
        setCurrentPage(1)
        setSearchParams({ page: 1, sort })
    }, [sort])

    useEffect(() => {
        setComponentsLoading(loading);
    }, [loading]);

    useEffect(() => {
        setCurrentPage(1);
        setSearchParams({ page: 1, sort });
    }, [id, slug]);
    if (loading) return <ComponentLoading />;
    if (error) return <p>Lỗi: {error}</p>;
    return (
        <section>
            <BannerPages />
            <div className="grid lg:grid-cols-12 grid-cols-1 bg-[#ffffff] w-[85%] mx-auto my-12 gap-2">
                <div className="lg:col-span-3">
                    <GenreList />
                    <GenrePublisher />
                    <GenrePrice priceRange={priceRange} setPriceRange={setPriceRange} />
                </div>

                <div className="lg:col-span-9 gap-4">
                    <div className="flex flex-col  lg:flex-row lg:justify-between mb-6 lg:mt-0 mt-4 ml-2">
                        <Title
                            title={publisher.name}
                            className="lg:text-[22px] sm:text-base  text-sm font-medium text-[#2d525c]"
                        />
                        <SortBook sort={sort} setSort={setSort} />
                    </div>

                    <div className="grid lg:grid-cols-4 grid-cols-2 sm:grid-cols-3 gap-4">
                        {publisherByBook.map((book, index) => (
                            <BookCard key={index} book={book} />
                        ))}
                    </div>
                    {pagination?.total > 0 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                current={pagination.page || currentPage}
                                pageSize={pagination.limit || 20}
                                total={pagination.total}
                                onChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
