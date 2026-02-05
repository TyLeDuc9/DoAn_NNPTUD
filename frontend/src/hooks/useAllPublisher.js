import React, { useEffect, useState } from 'react'
import { getAllPublisher } from '../services/publisherApi';
export const useAllPublisher = (page = 1, limit = 20, search = "", sort = "newest") => {
    const [publisher, setPublisher] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPublisher = async () => {
            try {
                setLoading(true);
                const data = await getAllPublisher(page, limit, search, sort);

                setPublisher(data.publishers);
                setPagination(data.pagination);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchAllPublisher();
    }, [page, limit, search, sort]);

    return {
        publisher,
        pagination,
        loading,
        error,
    };
};
