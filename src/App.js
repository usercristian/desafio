import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Globais
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Páginas (Rotas)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Info from './pages/Info';
import Contact from './pages/Contact';
import MyPurchases from './pages/MyPurchases';
import Checkout from './pages/Checkout';
import Evaluation from './pages/Evaluation';

function App() {
  return (
    <Router>
      {}
      <div className="flex flex-col min-h-screen bg-happy-bg text-happy-text font-roboto-slab">
        
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Rota Inicial */}
            <Route path="/" element={<Home />} />
            
            {/* Autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Institucional e Contato */}
            <Route path="/info" element={<Info />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Área do Cliente e Compra */}
            <Route path="/my-purchases" element={<MyPurchases />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/evaluation" element={<Evaluation />} />
          </Routes>
        </main>

        {}
        <Chatbot />

        <Footer />
        
      </div>
    </Router>
  );
}

export default App;