import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';


export const useLoadingEffect = (delay = 1000) => {
    const { setIsLoading } = useLoading()
    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, delay)
        return () => clearTimeout(timer)
    }, [delay])

}
