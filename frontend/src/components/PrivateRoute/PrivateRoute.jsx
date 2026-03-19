// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// export const PrivateRoute = ({ children }) => {
//   const user = useSelector((state) => state.auth.user);

//   if (!user) {
//     return <Navigate to="/tai-khoan/dang-nhap" replace />;
//   }

//   if (user.role !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };
