import { useState } from "react";
import { forgotPassword } from "../services/userApi";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendForgotPassword = async (email) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    message,
    error,
    sendForgotPassword,
  };
};
