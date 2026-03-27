import React from 'react';
import { Link } from 'react-router-dom';

export const ViewAll = ({ id, slug }) => {
    if (!id || !slug) return null;

    return (
        <Link
            to={`/danh-muc/${id}/${slug}`}
            className="flex justify-end lg:mr-8 mr-2 lg:text-base text-sm cursor-pointer text-red-600 hover:text-red-400"
        >
            Xem tất cả &gt;&gt;
        </Link>
    );
};
