'use client'

import React from 'react';
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


function App() {
    return (
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
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/book/:id" element={<BookDetail />} />
                    </Routes>
                    <Footer />
                </Router>
        </AuthProvider>
           
        
                
    );
}

export default App;