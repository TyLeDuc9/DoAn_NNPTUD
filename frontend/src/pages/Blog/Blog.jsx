import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBlogById } from '../../services/blogApi'
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const Blog = () => {
    const { id } = useParams()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { setComponentsLoading } = useLoading();

    useEffect(() => {
        setComponentsLoading(loading)
    }, [loading])
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await getBlogById(id)
                setBlog(data.blog)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [id])

    if (loading) return <ComponentLoading/>
    if (error) return <p className="text-center text-red-500">{error}</p>
    if (!blog) return <p className="text-center mt-10">Không tìm thấy blog</p>

    return (
        <div className="bg-[#ffffff] w-[85%] mx-auto min-h-screen my-6">
            <h1 className="lg:text-2xl text-lg font-bold lg:mb-4 mb-2 text-center lg:py-12 py-6">{blog.title}</h1>
            <div className="text-gray-800 leading-relaxed">
                {blog.content.split('\r\n\r\n').map((para, index) => (
                    <div key={index} className="mb-6">
                        {/* Hiển thị đoạn văn */}
                        <p className="mb-4 whitespace-pre-line text-sm lg:text-base">{para}</p>

                        {/* Hiển thị ảnh tương ứng với đoạn, nếu có */}
                        {blog.images[index] && (
                            <img
                                src={blog.images[index]}
                                alt={`${blog.title} - ${index + 1}`}
                                className="lg:w-[50%] w-full rounded-sm object-contain mx-auto mb-4"
                            />
                        )}
                    </div>
                ))}
            </div>

        </div>
    )
}
