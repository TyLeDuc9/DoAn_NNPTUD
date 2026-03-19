import {getLatestBook} from "../services/bookDetailApi";
import React, { useState, useEffect } from 'react'

export const useLatestBook = () => {
    const [latestBook, setLatestBook] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await getLatestBook()
                setLatestBook(data)
            } catch (err) {
                setErr(err)
            } finally {
                setLoading(false)
            }
        }
        fetchCategory()
    }, [])
    return { latestBook, loading, err }
}
