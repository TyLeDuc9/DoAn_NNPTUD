import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/Auth/authSlice";
import { fetchCart } from "../../redux/Cart/apiCart";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
export const LoginEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      // Gửi token Google về backend
      const res = await axios.post(`${API}/auth/login-google`, {
        token: idToken,
      });



      // Lưu vào localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update Redux state với user object
      dispatch(loginSuccess(res.data.user));

      // Sau khi login, load giỏ hàng
      await fetchCart(dispatch);

      setTimeout(() => navigate("/"), 300);
    } catch (err) {
      console.error("❌ Lỗi Google Login:", err.response?.data || err.message);
    }
  };

  return (
    <div className="lg:w-[50%] sm:w-[50% w-full rounded-lg">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("❌ Google Login Failed");
        }}
        useOneTap
      />
    </div>
  );
};
