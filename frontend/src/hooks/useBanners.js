import { getBanners } from "../services/bannerApi";
import React, { useEffect, useState } from 'react'

export const useBanners = () => {
    const [banners, setBanners] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const data = await getBanners()
                setBanners(data)
            } catch (err) {
                setErr(err)
            } finally {
                setLoading(false)
            }
        }
        fetchBanner()
    }, [])
    return { banners, loading, err }
}
