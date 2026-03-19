import React from 'react'

export const BookDetailDescription = ({ book }) => {
    return (
        <div>
            <div className='mt-4 lg:text-base text-sm'>
                <span className='underline font-semibold'>Nội dung</span>
                <p className="whitespace-pre-line my-2" >
                    {book.description}
                </p>
                <span className='underline font-semibold'>Tác giả</span>
                <p className=''>{book.author_id[0].name}</p>
                <p className=''>{book.author_id[0].bio}</p>
            </div>
        </div>
    )
}
