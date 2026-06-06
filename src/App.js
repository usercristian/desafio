import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Globais
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Páginas (Rotas)
import Home from './pages/Home';
import Login from './pages/Login';
import MfaVerify from './pages/MfaVerify';
import Register from './pages/Register';
import Security from './pages/Security';
import Info from './pages/Info';
import Contact from './pages/Contact';
import MyPurchases from './pages/MyPurchases';
import Checkout from './pages/Checkout';
import Evaluation from './pages/Evaluation';

function App() {
  return (
    <Router>
      { }
      <div className="flex flex-col min-h-screen bg-happy-bg dark:bg-gray-900 text-happy-text dark:text-gray-100 font-roboto-slab transition-colors duration-200">

        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Rota Inicial */}
            <Route path="/" element={<Home />} />

            {/* Autenticação */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mfa" element={<MfaVerify />} />
            <Route path="/security" element={<Security />} />

            {/* Institucional e Contato */}
            <Route path="/info" element={<Info />} />
            <Route path="/contact" element={<Contact />} />

            {/* Área do Cliente e Compra */}
            <Route path="/my-purchases" element={<MyPurchases />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/evaluation/:productId" element={<Evaluation />} />
          </Routes>
        </main>

        { }
        <Chatbot />

        <Footer />

      </div>
    </Router>
  );
}

export default App;
