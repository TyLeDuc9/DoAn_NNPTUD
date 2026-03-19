import React from 'react'
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export const EmployeeRoute = ({ children }) => {
    const currentUser = useSelector((state) => state.auth.login.currentUser);

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (currentUser.role !== "employee") {
        return <Navigate to="/" replace />;
    }

    return children;
};