'use client'

import React, { Profiler } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductPage from './components/ProductPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetail from './pages/BookDetail';
import ChangePassword from './pages/ChangePassword';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Profile from './pages/Profile';
import Success from './pages/Success';
import Checkout from './pages/Checkout';



function App() {
    return (
        <CartProvider>
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={
                        <ProtectedRoute>
                            <Login />
                        </ProtectedRoute>
                    } />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    <Route path="/change-password" element={
                        <PrivateRoute>
                            <ChangePassword />
                        </PrivateRoute>
                    } />
                    <Route path="/book/:id" element={<BookDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/checkout" element={
                        <PrivateRoute>
                            <Checkout />
                        </PrivateRoute>
                    } />
                    <Route path="/success" element={<Success />} />                
                
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    </CartProvider>
                
    );
}

export default App;