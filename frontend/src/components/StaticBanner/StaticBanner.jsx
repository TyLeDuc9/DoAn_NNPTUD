import React from 'react'

export const StaticBanner = ({image, title='', className=''}) => {
    return (
        <div className='w-[85%] mx-auto'>
            <img src={image} alt={title} className={`${className}`} />
        </div>
    )
}
