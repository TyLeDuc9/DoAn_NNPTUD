import React, { useEffect, useState } from 'react'
import { getRelatedBook } from '../services/bookDetailApi'
import { useParams } from 'react-router-dom';
export const useRelatedBook = () => {
    const { id, slug } = useParams();
    const [relatedBook, setRelatedBook] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchRelatedBook = async () => {
            try {
                setLoading(true)
                const data = await getRelatedBook(id, slug)
                setRelatedBook(data.relatedBooks)
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchRelatedBook()
    }, [id, slug])

    return {
        relatedBook, loading, error
    }
}
