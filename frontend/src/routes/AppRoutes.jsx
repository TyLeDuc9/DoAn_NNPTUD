import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { Home } from "../pages/Home/Home";
import { CategoryBook } from "../pages/CategoryBook/CategoryBook";
import { AllBook } from "../pages/AllBook/AllBook";
import { BookDetail } from "../pages/BookDetail/BookDetail";
import { Publisher } from "../pages/Publisher/Publisher";
import { PublisherByBook } from "../pages/PublisherByBook/PublisherByBook";
import { Cart } from "../pages/Cart/Cart";
import { SearchPage } from "../pages/Search/SearchPage";
import { Login } from '../pages/Login/Login'
import { Account } from "../pages/Account/Account";
import { Register } from "../pages/Register/Register";
import { FavoritePage } from "../pages/FavoritePage/FavoritePage";
import { Introduce } from '../pages/Introduce/Introduce'
import { CheckOutStepOne } from "../pages/CheckOut/CheckOutStepOne";
import { CheckOutStepTwo } from "../pages/CheckOut/CheckOutStepTwo";
import { ForgotPassword } from "../pages/ForgotPassword/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword/ResetPassword";
import { PaymentResult } from "../pages/Payment/PaymentResult";



import { AdminRoute } from "./AdminRoute";
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { ProfileAdmin } from '../pages/ProfileAdmin/ProfileAdmin';
import { User } from '../pages/User/User';
import { CategoryAdmin } from '../pages/CategoryAdmin/CategoryAdmin';
import { PublisherAdmin } from '../pages/PublisherAdmin/PublisherAdmin';
import { BlogAdmin } from '../pages/BlogAdmin/BlogAdmin';
import { BookAdmin } from '../pages/BookAdmin/BookAdmin';
import { EmployeeAdmin } from '../pages/EmployeeAdmin/EmployeeAdmin';
import { BookDetailAdmin } from '../pages/BookDetailAdmin/BookDetailAdmin';
import { BannerAdmin } from '../pages/BannerAdmin/BannerAdmin';
import { AuthorAdmin } from '../pages/AuthorAdmin/AuthorAdmin';
import { EditUser } from '../pages/EditUser/EditUser';
import { EditEmployee } from '../pages/EditEmployee/EditEmployee';
import { EditCategory } from '../pages/EditCategory/EditCategory';
import { EditAuthor } from '../pages/EditAuthor/EditAuthor';
import { EditPublisher } from '../pages/EditPublisher/EditPublisher';
import { EditBanner } from '../pages/EditBanner/EditBanner';
import { EditBook } from '../pages/EditBook/EditBook';
import { EditBlog } from '../pages/EditBlog/EditBlog';
import { EditAddressShipping } from '../pages/EditAddressShipping/EditAddressShipping';
import { EditBookDetail } from '../pages/EditBookDetail/EditBookDetail';
import { EditDiscount } from '../pages/EditDiscount/EditDiscount';
import { AddBookDetail } from '../pages/AddBookDetail/AddBookDetail';
import { AllBookListAdmin } from '../pages/AllBookListAdmin/AllBookListAdmin';
import { DiscountAdmin } from '../pages/DiscountAdmin/DiscountAdmin';
import { FavoriteAdmin } from '../pages/FavoriteAdmin/FavoriteAdmin';
import { RatingAdmin } from '../pages/RatingAdmin/RatingAdmin';
import { CommentAdmin } from '../pages/CommentAdmin/CommentAdmin';
import { OrderDetail } from '../pages/OrderDetail/OrderDetail';
import { ShippingAddressAdmin } from '../pages/ShippingAddressAdmin/ShippingAddressAdmin';
import { CartAdmin } from '../pages/CartAdmin/CartAdmin';
import { Blog } from '../pages/Blog/Blog';
import { OrderAdmin } from '../pages/OrderAdmin/OrderAdmin';
import { OrderDetailAdmin } from '../pages/OrderAdmin/OrderDetailAdmin';
import { ChangePassAdmin } from '../pages/ChangePassAdmin/ChangePassAdmin';


import { RegisterEmployee } from '../pages/RegisterEmployee/RegisterEmployee';
import { LoginEmployee } from '../pages/LoginEmployee/LoginEmployee';
import { EmployeeRoute } from "./EmployeeRoute";
import { Employee } from "../pages/Employee/Employee";
import { ProfileEmployee } from "../pages/ProfileEmployee/ProfileEmployee";
import { UserEmployee } from "../pages/UserEmployee/UserEmployee";
import { OrderEmployee } from "../pages/OrderEmployee/OrderEmployee";
import { OrderDetailEmployee } from "../pages/OrderEmployee/OrderDetailEmployee";
import { CartEmployee } from "../pages/CartEmployee/CartEmployee";
import { ShippingAddressEmployee } from "../pages/ShippingAddressEmployee/ShippingAddressEmployee";
import { CategoryEmployee } from "../pages/CategoryEmployee/CategoryEmployee";
import { BookEmployee } from "../pages/BookEmployee/BookEmployee";
import { BookDetailEmployee } from "../pages/BookDetailEmployee/BookDetailEmployee";
import { AuthorEmployee } from "../pages/AuthorEmployee/AuthorEmployee";
import { PublisherEmployee } from "../pages/PublisherEmployee/PublisherEmployee";
import { BlogEmployee } from "../pages/BlogEmployee/BlogEmployee";
import { BannerEmployee } from "../pages/BannerEmployee/BannerEmployee";
import { FavoriteEmployee } from "../pages/FavoriteEmployee/FavoriteEmployee";
import { RatingEmployee } from "../pages/RatingEmployee/RatingEmployee";
import { CommentEmployee } from "../pages/CommentEmployee/CommentEmployee";
import { AllBookListEmployee } from "../pages/AllBookListEmployee/AllBookListEmployee";
import { ChangePassEmployee } from "../pages/ChangePassEmployee/ChangePassEmployee";

//Admin
import { Admin } from "../pages/Admin/Admin";
import { LoginAdmin } from '../pages/LoginAdmin/LoginAdmin'
export const AppRoutes = () => {
  return (
    <Routes>

      {/* Các trang web chính dùng Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="danh-muc/:id/:slug" element={<CategoryBook />} />
        <Route path="tat-ca-sach" element={<AllBook />} />
        <Route path="san-pham/:id/:slug" element={<BookDetail />} />
        <Route path="nha-xuat-ban" element={<Publisher />} />
        <Route path="nha-xuat-ban/:id/:slug" element={<PublisherByBook />} />
        <Route path="gio-hang" element={<Cart />} />
        <Route path="tim-kiem" element={<SearchPage />} />
        <Route path="tai-khoan" element={<Account />} />
        <Route path="yeu-thich" element={<FavoritePage />} />
        <Route path="gioi-thieu" element={<Introduce />} />
        <Route path="blog/:id" element={<Blog />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
      </Route>

      <Route path="tai-khoan/dang-ky" element={<Register />} />
      <Route path="tai-khoan/dang-nhap" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/checkout-step-one" element={<CheckOutStepOne />} />
      <Route path="/checkout-step-two" element={<CheckOutStepTwo />} />
      <Route path="/payment-result" element={<PaymentResult />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route path="/admin" element={<Admin />}>
        <Route path="register-employee" element={<RegisterEmployee />} />
        <Route path="dashboard" index element={<Dashboard />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="employee" element={<EmployeeAdmin />} />
        <Route path="user" element={<User />} />
        <Route path="category" element={<CategoryAdmin />} />
        <Route path="author" element={<AuthorAdmin />} />
        <Route path="publisher" element={<PublisherAdmin />} />
        <Route path="book" element={<BookAdmin />} />
        <Route path="book-detail" element={<BookDetailAdmin />} />
        <Route path="blog" element={<BlogAdmin />} />
        <Route path="banner" element={<BannerAdmin />} />
        <Route path="add-bookdetail" element={<AddBookDetail />} />
        <Route path="all-booklist" element={<AllBookListAdmin />} />
        <Route path="discount" element={<DiscountAdmin />} />
        <Route path="favorite" element={<FavoriteAdmin />} />
        <Route path="rating" element={<RatingAdmin />} />
        <Route path="comment" element={<CommentAdmin />} />
        <Route path="shipping-address" element={<ShippingAddressAdmin />} />
        <Route path="cart" element={<CartAdmin />} />
        <Route path="order" element={<OrderAdmin />} />
        <Route path="order-detail/:orderId" element={<OrderDetailAdmin />} />
        <Route path="change-pass" element={<ChangePassAdmin />} />

        <Route path="/admin/user/edit/:id" element={<EditUser />} />
        <Route path="/admin/employee/edit/:id" element={<EditEmployee />} />
        <Route path="/admin/category/edit/:id" element={<EditCategory />} />
        <Route path="/admin/author/edit/:id" element={<EditAuthor />} />
        <Route path="/admin/publisher/edit/:id" element={<EditPublisher />} />
        <Route path="/admin/banner/edit/:id" element={<EditBanner />} />
        <Route path="/admin/book/edit/:id" element={<EditBook />} />
        <Route path="/admin/book-detail/edit/:id" element={<EditBookDetail />} />
        <Route path="/admin/discount/edit/:id" element={<EditDiscount />} />
        <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
        <Route path="/admin/shipping-address/edit/:id" element={<EditAddressShipping />} />
      </Route>

      <Route
        path="/employee"
        element={
          <EmployeeRoute>
            <Employee />
          </EmployeeRoute>
        }
      />

      <Route path='/employee' element={<Employee />} >
        <Route path="profile" element={<ProfileEmployee />} />
        <Route path="user" element={<UserEmployee />} />
        <Route path="order" element={<OrderEmployee />} />
        <Route path="order-detail/:orderId" element={<OrderDetailEmployee />} />
        <Route path="cart" element={<CartEmployee />} />
        <Route path="shipping-address" element={<ShippingAddressEmployee />} />
        <Route path="category" element={< CategoryEmployee />} />
        <Route path="book" element={< BookEmployee />} />
        <Route path="book-detail" element={<BookDetailEmployee />} />
        <Route path="author" element={<AuthorEmployee />} />
        <Route path="publisher" element={<PublisherEmployee />} />
        <Route path="blog" element={<BlogEmployee />} />
        <Route path="banner" element={<BannerEmployee />} />
        <Route path="favorite" element={<FavoriteEmployee />} />
        <Route path="rating" element={<RatingEmployee />} />
        <Route path="comment" element={<CommentEmployee />} />
        <Route path="all-booklist" element={<AllBookListEmployee />} />
        <Route path="change-pass" element={<ChangePassEmployee />} />

      </Route>


      <Route path="/login-admin" element={<LoginAdmin />} />
      <Route path="/login-employee" element={<LoginEmployee />} />
    </Routes>
  );
};  
