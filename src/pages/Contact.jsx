import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '', optin: false });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'O campo nome é obrigatório.';
    if (!formData.email.trim()) {
      newErrors.email = 'O campo e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor, insira um e-mail válido.';
    }
    if (!formData.mensagem.trim()) newErrors.mensagem = 'Por favor, escreva uma mensagem.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowModal(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg flex-grow">
      <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100">
        <h2 className="text-center text-2xl font-bold text-happy-text mb-2">Fale Conosco</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Dúvidas ou sugestões? Preencha o formulário abaixo.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="contact-nome" className="block text-sm font-bold text-gray-700 mb-1">Seu Nome</label>
            <input 
              type="text" 
              id="contact-nome"
              className={`input-field ${errors.nome ? 'border-happy-pink focus:ring-happy-pink' : ''}`}
              placeholder="Ex: Alex"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
            {errors.nome && <span className="text-xs text-happy-pink" role="alert">{errors.nome}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="contact-email" className="block text-sm font-bold text-gray-700 mb-1">Seu E-mail</label>
            <input 
              type="email" 
              id="contact-email"
              className={`input-field ${errors.email ? 'border-happy-pink focus:ring-happy-pink' : ''}`}
              placeholder="alex@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <span className="text-xs text-happy-pink" role="alert">{errors.email}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="contact-mensagem" className="block text-sm font-bold text-gray-700 mb-1">Mensagem</label>
            <textarea 
              id="contact-mensagem"
              rows="4"
              className={`input-field resize-none ${errors.mensagem ? 'border-happy-pink focus:ring-happy-pink' : ''}`}
              placeholder="Digite aqui..."
              value={formData.mensagem}
              onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
            ></textarea>
            {errors.mensagem && <span className="text-xs text-happy-pink" role="alert">{errors.mensagem}</span>}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input 
              type="checkbox" 
              id="optin"
              className="accent-happy-pink w-4 h-4"
              checked={formData.optin}
              onChange={(e) => setFormData({...formData, optin: e.target.checked})}
            />
            <label htmlFor="optin" className="text-sm text-gray-600">Deseja receber novidades?</label>
          </div>

          <button type="submit" className="btn-primary w-full py-3 shadow-md">
            Enviar Mensagem
          </button>
        </form>
      </div>

      {/* Modal de Sucesso */}
      {showModal && (
        <ContactSuccessModal onContinue={() => navigate('/')} />
      )}
    </div>
  );
};

/* ── Modal de sucesso (acessível) ── */
const ContactSuccessModal = ({ onContinue }) => {
  const modalRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    btnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onContinue(); return; }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-success-title"
        className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-[fadeIn_0.3s]"
      >
        <h2 id="contact-success-title" className="text-xl font-bold text-happy-blue-text mb-2">Mensagem Recebida!</h2>
        <p className="text-gray-600 mb-6">Obrigado por entrar em contato! Responderemos em breve.</p>
        <button
          ref={btnRef}
          onClick={onContinue}
          className="btn-primary w-full py-2"
        >
          Continuar navegando
        </button>
      </div>
    </div>
  );
};

export default Contact;