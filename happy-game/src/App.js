import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <--- Import do Footer
import Chatbot from './components/Chatbot';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-happy-bg text-happy-text font-roboto-slab">
        
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Rotas Placeholders (Vamos criar essas páginas a seguir) */}
            <Route path="/info" element={<div className="p-10 text-center">Página de Informações (Em breve)</div>} />
            <Route path="/contact" element={<div className="p-10 text-center">Página de Contato (Em breve)</div>} />
            <Route path="/my-purchases" element={<div className="p-10 text-center">Minhas Compras (Em breve)</div>} />
            <Route path="/login" element={<div className="p-10 text-center">Login (Em breve)</div>} />
            <Route path="/checkout" element={<div className="p-10 text-center">Checkout (Em breve)</div>} />
          </Routes>
        </main>

        {/* Chatbot Global */}
        <Chatbot />

        {/* Footer Global */}
        <Footer /> 
        
      </div>
    </Router>
  );
}

export default App;