import React, { useState, useEffect } from 'react'
import { getRandomBook } from '../services/bookDetailApi'
export const useRandomBook = () => {
    const [randomBook, setRandomBook] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    useEffect(() => {
        const fetchRandom = async () => {
            try {
                const data = await getRandomBook()
                setRandomBook(data)
            } catch (err) {
                setErr(err)
            } finally {
                setLoading(false)
            }
        }
        fetchRandom()
    }, [])
    return { randomBook, loading, err }
}

