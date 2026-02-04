import React from 'react'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { Outlet } from "react-router-dom";
import { ScrollToTopButton } from '../components/ScrollToTopButton/ScrollToTopButton';
import { Message } from '../components/Message/Message';
export const Layout = () => {
    return (
        <div className=''>
            <Header />
            <main className="">
                <Outlet />
                <Message />
                <ScrollToTopButton />
            </main>
            <Footer />
        </div>
    )
}
