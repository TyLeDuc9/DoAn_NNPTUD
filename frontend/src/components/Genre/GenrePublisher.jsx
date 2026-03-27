import React, { useState, useEffect } from 'react'
import { BiMinus } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Title } from '../Title/Title';
import { useAllPublisher } from '../../hooks/useAllPublisher';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const GenrePublisher = () => {
    const { publisher, loading, error } = useAllPublisher();

    const [show, setShow] = useState(false)

    const handleShow = () => {
        setShow(prev => !prev);
    };
    const { setComponentsLoading } = useLoading();

    useEffect(() => {
        setComponentsLoading(loading);
    }, [loading]);
    if (loading) return <ComponentLoading />;
    if (error) return <p>Error: {error}</p>;
    return (
        <div className='my-4 lg:px-6'>
            <div
                className='flex bg-[#386673] rounded-xs py-2 items-center justify-between cursor-pointer duration-100 ease-in-out'
                onClick={handleShow}
            >
                <Title
                    className="lg:text-base text-sm font-bold text-white pl-12"
                    title="Thương hiệu"
                />
                {show
                    ? <AiOutlineMinus className='lg:text-4xl text-3xl text-white p-2 font-bold' />
                    : <AiOutlinePlus className='lg:text-4xl text-3xl text-white p-2 font-bold' />
                }
            </div>

            {show && (
                <div className="p-2 border-l-2 border-r-2 border-b-2 border-gray-300 shadow-xs">
                    <ul className='px-6'>
                        {publisher.map((genre) => (
                            <li
                                key={genre._id}
                                className="uppercase font-medium text-[#515f63] flex items-center space-y-2
                                 hover:text-[#679aab] duration-75 ease-in text-[14px]"
                            >
                                <BiMinus className="text-black text-2xl font-bold pt-2.5" />
                                <Link to={`/nha-xuat-ban/${genre._id}/${genre.slug}`}>{genre.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
