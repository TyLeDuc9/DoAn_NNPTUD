import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import {Introduce} from '../pages/Introduce/Introduce'
import { Home } from '../pages/Home/Home';
export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="gioi-thieu" element={<Introduce />} />
            </Route>
        </Routes>
    )
}
