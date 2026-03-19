import React, { useEffect, useState } from 'react';
import { getAllBookByPublisher } from '../services/bookDetailApi';

export const useAllBookByPublisher = (id, slug, page = 1, limit = 20, sort = "newest", priceRange = "all") => {

  const [publisherByBook, setPublisherByBook] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publisher, setPublisher] = useState([])

  useEffect(() => {
    if (!id || !slug) return;
    const fetchBookByPublisher = async () => {
      setLoading(true);
      try {

        const data = await getAllBookByPublisher(id, slug, page, limit, sort, priceRange);
        setPublisherByBook(data.books || []);
        setPagination(data.pagination);
        setPublisher(data.publisher)
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookByPublisher();
  }, [id, slug, page, limit, sort, priceRange]);

  return {
    publisherByBook, error, pagination, loading, publisher
  };
};
