import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    nome: '',
    senha: '',
    acceptTerms: false
  });

  // Máscara simples para telefone (DDD) XXXXX-XXXX
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 7) { // Ajustado para a máscara ficar correta com 9 dígitos
      value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }

    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const isFormFilled =
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.nome.trim() !== '' &&
    formData.senha.trim() !== '' &&
    formData.acceptTerms === true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!formData.email.includes('@')) {
      alert('E-mail inválido');
      return;
    }
    if (formData.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!formData.acceptTerms) {
      alert('Você precisa aceitar os termos.');
      return;
    }

    try {
      // Chamada real para a API Fake do json-server-auth
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.senha,
          nome: formData.nome,
          phone: formData.phone,
          acceptTerms: formData.acceptTerms
        })
      });

      // Se deu erro no cadastro
      if (!response.ok) {
        // Tenta ler mensagem retornada pelo backend
        const errorData = await response.json().catch(() => null);

        if (response.status === 400 || response.status === 409) {
          alert(errorData?.message || "Este e-mail já está cadastrado.");
        } else {
          alert("Erro ao cadastrar: " + response.status);
        }
        return;
      }

      // Se deu sucesso
      alert("Cadastro realizado com sucesso!");
      navigate("/login");

    } catch (error) {
      alert("Falha ao conectar ao servidor.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow py-10 px-4">
      <div className="w-full max-w-[500px] bg-white rounded-[15px] p-8 shadow-[0_0_20px_rgba(5,217,232,0.1)] border border-gray-50">

        <h2 className="text-center text-2xl font-bold text-happy-text mb-6">Cadastre-se</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Campo E-mail */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field py-3"
              placeholder="exemplo@email.com"
              required
            />
          </div>

          {/* Campo Telefone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="input-field py-3"
              placeholder="(XX) XXXXX-XXXX"
              required
            />
            <div className="text-gray-600 text-xs mt-1">DDD + número</div>
          </div>

          {/* Campo Nome */}
          <div className="mb-4">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={handleChange}
              className="input-field py-3"
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="mb-4">
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              id="senha"
              value={formData.senha}
              onChange={handleChange}
              className="input-field py-3"
              required
            />
          </div>

          {/* Checkbox Termos */}
          <div className="flex items-start gap-2 mt-4 mb-6">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 cursor-pointer accent-happy-pink"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer select-none">
              Aceito termos de Uso.
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormFilled}
            className={`btn-primary w-full py-3 text-lg shadow-md ${!isFormFilled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-happy-blue hover:text-white'
              }`}
          >
            Cadastrar
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;