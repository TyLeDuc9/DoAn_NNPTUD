import React from 'react'
import { Button } from "../Button/Button";
import { FaSearch } from "react-icons/fa";
export const SearchAdmin = () => {
    return (
        <div className="relative w-full">
            <form>
                <input
                    type="text"
                    placeholder="Tìm kiếm"

                    className="w-full px-4 py-4 font-semibold pr-12 bg-[#639eae]/80
               shadow-2xl text-white outline-none transition rounded-sm"
                />
                <Button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white p-2 
             transition cursor-pointer hover:opacity-75"
                >
                    <FaSearch size={20} />
                </Button>
            </form>


        </div>
    )
}
