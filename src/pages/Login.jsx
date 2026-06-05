import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [showRecoverModal, setShowRecoverModal] = useState(false);

  const isFormFilled = email.trim() !== '' && password.trim() !== '';
  const isFormrecoverFilled = recoverEmail.trim() !== '';

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
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      // 2) Se a resposta não for "ok", significa e-mail/senha errados ou outro erro
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || 'E-mail ou senha incorretos.');
        return;
      }

      // 3) Em caso de sucesso, verifica se autenticação é por MFA
      const data = await response.json();

      if (data.requiresMfa === true) {
        sessionStorage.setItem('mfaToken', data.mfaToken);

        if (data.user) {
          sessionStorage.setItem('pendingMfaUser', JSON.stringify(data.user));
        }
        navigate('/mfa');
        return;
      }

      // 4) Se não precisar de MFA, armazena o token e o usuário para manter sessão
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('storage'));

      // 5) Redireciona para a página inicial ou protegida
      navigate('/my-purchases');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro de conexão. Tente novamente.');
    }
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();

    if (!recoverEmail.includes('@')) {
      alert('E-mail inválido');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/check-email?email=${recoverEmail}`);
      const data = await response.json();

      if (!data.exists) {
        alert('E-mail não cadastrado.');
        return;
      }

      alert('Um link de recuperação foi enviado para seu e-mail.');
      setShowRecoverModal(false);

    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      alert('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow py-10 px-4">
      {/* Container de Login (Estilo Original .login-container) */}
      <div className="w-full max-w-[400px] bg-white dark:bg-gray-800 rounded-[15px] p-8 shadow-[0_0_20px_rgba(5,217,232,0.1)] border border-gray-50 dark:border-gray-700">

        {/* Cabeçalho com Logo (Estilo .logo-container) */}
        <div className="bg-happy-pink rounded-[10px] p-4 mb-8 flex items-center justify-center shadow-md">
          <img src="/images/logo.png" alt="Logo" className="h-10 w-auto mr-3 bg-white rounded-full p-1" />
          <span className="text-white text-2xl font-bold">Happy Game</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-happy-text dark:text-gray-100 mb-1">Entre</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Insira seu e-mail cadastrado</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Campo E-mail */}
          <div className="mb-4">
            <label htmlFor="login-email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">E-mail</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field py-3"
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="mb-4">
            <label htmlFor="login-password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Senha</label>
            <input
              type="password"
              id="login-password"
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
              className="text-happy-blue-text dark:text-happy-blue hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline bg-transparent border-none p-0 cursor-pointer"
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
        <RecoverModal
          recoverEmail={recoverEmail}
          setRecoverEmail={setRecoverEmail}
          isFormrecoverFilled={isFormrecoverFilled}
          onClose={() => setShowRecoverModal(false)}
          onSubmit={handleRecoverSubmit}
        />
      )}
    </div>
  );
};

/* ── Modal de recuperação de senha (acessível) ── */
const RecoverModal = ({ recoverEmail, setRecoverEmail, isFormrecoverFilled, onClose, onSubmit }) => {
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus no input ao abrir
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recover-modal-title"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 animate-[fadeIn_0.3s_ease-out]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="recover-modal-title" className="text-lg font-bold text-happy-text dark:text-gray-100">Recuperar Senha</h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
        </p>

        <form onSubmit={onSubmit}>
          <label htmlFor="recover-email" className="sr-only">E-mail de recuperação</label>
          <input
            ref={inputRef}
            type="email"
            id="recover-email"
            value={recoverEmail}
            onChange={(e) => setRecoverEmail(e.target.value)}
            className="input-field mb-4"
            placeholder="seu@email.com"
            required
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormrecoverFilled}
              className={`btn-primary py-2 px-4 text-sm ${!isFormrecoverFilled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-happy-blue hover:text-white'
                }`}
            >
              Enviar Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;