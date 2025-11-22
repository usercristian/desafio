import React, { useState } from 'react';
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
            <label className="block text-sm font-bold text-gray-700 mb-1">Seu Nome</label>
            <input 
              type="text" 
              className={`input-field ${errors.nome ? 'border-happy-pink focus:ring-happy-pink' : ''}`}
              placeholder="Ex: Alex"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
            {errors.nome && <span className="text-xs text-happy-pink">{errors.nome}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Seu E-mail</label>
            <input 
              type="email" 
              className={`input-field ${errors.email ? 'border-happy-pink focus:ring-happy-pink' : ''}`}
              placeholder="alex@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <span className="text-xs text-happy-pink">{errors.email}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Mensagem</label>
            <textarea 
              rows="4"
              className={`input-field resize-none ${errors.mensagem ? 'border-happy-pink focus:ring-happy-pink' : ''}`}
              placeholder="Digite aqui..."
              value={formData.mensagem}
              onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
            ></textarea>
            {errors.mensagem && <span className="text-xs text-happy-pink">{errors.mensagem}</span>}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-[fadeIn_0.3s]">
            <h5 className="text-xl font-bold text-happy-blue mb-2">Mensagem Recebida!</h5>
            <p className="text-gray-600 mb-6">Obrigado por entrar em contato! Responderemos em breve.</p>
            <button 
              onClick={() => navigate('/')}
              className="btn-primary w-full py-2"
            >
              Continuar navegando
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;