import React, { useEffect, useCallback } from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

import LoadingSpinner from "./components/LoadingSpinner.jsx";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CustomerSupport from "./pages/CustomerSupport.jsx";

import { MessageCircleMore } from "lucide-react";
import { motion } from "framer-motion"; // Import Framer Motion

const App = () => {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

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

  if (checkingAuth === true) return <LoadingSpinner />;

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
          <Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />}></Route>
          <Route path="/category/:category" element={<CategoryPage />}></Route>
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />}></Route>
          <Route path="/customer-Support" element={user ? <CustomerSupport /> : <Navigate to="/login" />}></Route>
        </Routes>
      </div>

      {/* Chat Icon */}
      {user && (
        <Link to="/customer-Support">
          <motion.div
            className="fixed bottom-6 right-6 bg-emerald-400 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-emerald-500 transition-all z-50"
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}  
            initial={{ opacity: 0 }}   
            animate={{ opacity: 1 }}   
            transition={{ duration: 0.5 }}
            style={{ position: 'fixed', bottom: '6%', right: '6%', zIndex: 50 }}
          >
            <MessageCircleMore size={24} />
          </motion.div>
        </Link>
      )}

      <Toaster />
    </div>
  );
};

export default App;
