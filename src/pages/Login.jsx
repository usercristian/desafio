import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRecoverModal, setShowRecoverModal] = useState(false);

  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validação cliente (antes de chamar servidor)
    if (!email.includes('@')) {
      alert('E-mail inválido');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter ao menos 6 caracteres');
      return;
    }

    // 1) Envia os dados para o endpoint /login do backend      
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      // 2) Se a resposta não for “ok”, significa e-mail/senha errados ou outro erro
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || 'E-mail ou senha incorretos.');
        return;
      }

      // 3) Em caso de sucesso, obtemos o token e o usuário retornados
      const data = await response.json();

      // 4) Armazenamento do token / usuário para manter sessão
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 5) Redireciona para a página inicial ou protegida
      navigate('/my-purchases');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro de conexão. Tente novamente.');
    }
  };

  const handleRecoverSubmit = (e) => {
    e.preventDefault();
    alert('Um link de recuperação foi enviado para seu e-mail.');
    setShowRecoverModal(false);
  };

  return (
    <div className="flex items-center justify-center flex-grow py-10 px-4">
      {/* Container de Login (Estilo Original .login-container) */}
      <div className="w-full max-w-[400px] bg-white rounded-[15px] p-8 shadow-[0_0_20px_rgba(5,217,232,0.1)] border border-gray-50">

        {/* Cabeçalho com Logo (Estilo .logo-container) */}
        <div className="bg-happy-pink rounded-[10px] p-4 mb-8 flex items-center justify-center shadow-md">
          <img src="/images/logo.png" alt="Logo" className="h-10 w-auto mr-3 bg-white rounded-full p-1" />
          <span className="text-white text-2xl font-bold">Happy Game</span>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-happy-text mb-1">Entre</h3>
          <p className="text-gray-500 text-sm">Insira seu e-mail cadastrado</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Campo E-mail */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field py-3"
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field py-3"
              placeholder="Sua senha"
              required
            />
          </div>

          {/* Links de Ação */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <Link
              to="/register"
              className="font-medium text-happy-pink hover:text-happy-pink-dark transition-colors"
            >
              Cadastrar-se
            </Link>
            <button
              type="button"
              onClick={() => setShowRecoverModal(true)}
              className="text-happy-blue hover:text-cyan-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={!isFormFilled}
            className={`btn-primary w-full py-3 text-lg shadow-md ${!isFormFilled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-happy-blue hover:text-white'
              }`}
          >
            Entrar
          </button>
        </form>
      </div>

      {/* Modal de Recuperação de Senha */}
      {showRecoverModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-bold text-happy-text">Recuperar Senha</h5>
              <button
                onClick={() => setShowRecoverModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
            </p>

            <form onSubmit={handleRecoverSubmit}>
              <input
                type="email"
                className="input-field mb-4"
                placeholder="seu@email.com"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRecoverModal(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-sm"
                >
                  Enviar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;