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



function App() {
    return (
        <CartProvider>
        <AuthProvider>
            
             <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={
                            <ProtectedRoute>
                                <Login />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/book/:id" element={<BookDetail />} />
                        <Route path="/change-password" element={
                            <PrivateRoute>
                                <ChangePassword />
                            </PrivateRoute>
                        } />
                    </Routes>
                    <Footer />
                </Router>
        </AuthProvider>
        </CartProvider>
        
                
    );
}

export default App;