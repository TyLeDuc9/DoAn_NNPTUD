import React, { useState } from 'react'
import { resetPassword } from "../services/userApi";
export const useResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const submitResetPassword = async (token, password, confirmPassword) => {
        setLoading(true);
        setMessage("");
        setError("");
        try {
            const data = await resetPassword(token, password, confirmPassword);
            setMessage(data.message);
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return { loading, message, error, submitResetPassword };
};
