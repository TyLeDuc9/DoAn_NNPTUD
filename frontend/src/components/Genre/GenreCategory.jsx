import React, { useEffect } from "react";
import { FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAllCategory } from "../../hooks/useAllCategory";
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const GenreCategory = ({ mobile = false }) => {
    const { allCategory, loading, err } = useAllCategory();
    const { setComponentsLoading } = useLoading();
    useEffect(() => {
        setComponentsLoading(loading);
    }, [loading]);
    
    if (loading) return <ComponentLoading />;
    if (err) return <p>Error: {err}</p>;

    return (
        <div
            className={
                mobile
                    ? ""
                    : "absolute -left-8 top-full w-60 bg-white shadow-lg rounded-sm p-2 hidden group-hover:block z-50"
            }

        >
            <ul>
                {allCategory.map((genre) => (
                    <li
                        key={genre._id}
                        className={mobile ?
                            "flex gap-2 px-4 py-1.5 uppercase" :
                            "flex items-center gap-2 px-3 py-2 uppercase text-gray-800 text-sm font-medium hover:text-red-500 border-b last:border-none"}
                    >
                        <FaBook />
                        <Link to={`/danh-muc/${genre._id}/${genre.slug}`}>
                            {genre.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
