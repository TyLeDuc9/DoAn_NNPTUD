import React from 'react'
import { useLoading } from '../../context/LoadingContext';
export const ComponentLoading = () => {
    const { componentsLoading } = useLoading();

    if (!componentsLoading) return null;
    return (
        <div className="w-full h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full lg:h-14 lg:w-14 w-8 h-8 border-t-4 border-b-4 lg:border-t-4 lg:border-b-4 border-[#639eae]"></div>
        </div>

    )
}
