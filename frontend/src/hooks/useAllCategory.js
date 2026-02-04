import { getAllCategory } from "../services/categoryApi";
import React, { useState, useEffect } from 'react'

export const useAllCategory = () => {
    const [allCategory, setAllCategory] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await getAllCategory()
                setAllCategory(data.categories)
                
            } catch (err) {
                setErr(err)
            } finally {
                setLoading(false)
            }
        }
        fetchCategory()
    }, [])
    return { allCategory, loading, err,  }
}
