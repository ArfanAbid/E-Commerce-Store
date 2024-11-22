import React, { useEffect, useCallback } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

import LoadingSpinner from "./components/LoadingSpinner.jsx"
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CustomerSupport from "./pages/CustomerSupport.jsx";


const App = () => {
  const {user,checkAuth,checkingAuth}=useUserStore();
  const {getCartItems}=useCartStore();
  // console.log(user);
  // console.log(checkingAuth);

  
  // Wrap `checkAuth` and `getCartItems` in useCallback
  const performAuthCheck = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchCartItems = useCallback(() => {
    if (user) {
      getCartItems();
    }
  }, [getCartItems, user]);

  useEffect(() => {
    performAuthCheck();
  }, [performAuthCheck]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  if(checkingAuth===true) return <LoadingSpinner/>
  
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />}></Route>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />}></Route>
          <Route path="/secret-dashboard" element={user?.role==="admin" ? <AdminPage /> : <Navigate to="/login" />}></Route>
          <Route path="/category/:category" element={<CategoryPage />}></Route>
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />}></Route>
          <Route path="/customer-Support" element={user? <CustomerSupport /> : <Navigate to="/login" />}></Route>
        </Routes>
      </div>
      <Toaster/>
    </div>
  );
};

export default App;
