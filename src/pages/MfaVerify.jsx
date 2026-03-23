import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MfaVerify = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mfaToken = sessionStorage.getItem('mfaToken');
  const pendingUser = sessionStorage.getItem('pendingMfaUser');
  const parsedUser = pendingUser ? JSON.parse(pendingUser) : null;

  useEffect(() => {
    if (!mfaToken) {
      navigate('/login');
    }
  }, [mfaToken, navigate]);

  const handleSuccess = (data) => {
    sessionStorage.removeItem('mfaToken');
    sessionStorage.removeItem('pendingMfaUser');

    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('storage'));

    navigate('/my-purchases');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = useRecoveryCode ? recoveryCode.trim() : code.trim();

    if (!value || !mfaToken) {
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = useRecoveryCode
        ? 'http://localhost:3001/auth/mfa/recovery-code'
        : 'http://localhost:3001/auth/mfa/verify';

      const payload = useRecoveryCode
        ? { mfaToken, recoveryCode: value }
        : { mfaToken, code: value };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        alert(data?.message || 'Não foi possível validar o segundo fator.');
        return;
      }

      handleSuccess(data);
    } catch (error) {
      console.error('Erro ao verificar MFA:', error);
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow py-10 px-4">
      <div className="w-full max-w-[420px] bg-white rounded-[15px] p-8 shadow-[0_0_20px_rgba(5,217,232,0.1)] border border-gray-50">
        <div className="bg-happy-pink rounded-[10px] p-4 mb-8 flex items-center justify-center shadow-md">
          <img src="/images/logo.png" alt="Logo" className="h-10 w-auto mr-3 bg-white rounded-full p-1" />
          <span className="text-white text-2xl font-bold">Happy Game</span>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-happy-text mb-1">Verificação em duas etapas</h3>
          <p className="text-gray-500 text-sm">
            {parsedUser?.email ? `Confirme o acesso de ${parsedUser.email}` : 'Confirme seu acesso para entrar na conta.'}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setUseRecoveryCode(false)}
            className={`flex-1 py-2 rounded-lg font-bold transition-colors ${!useRecoveryCode ? 'bg-happy-pink text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            App autenticador
          </button>
          <button
            type="button"
            onClick={() => setUseRecoveryCode(true)}
            className={`flex-1 py-2 rounded-lg font-bold transition-colors ${useRecoveryCode ? 'bg-happy-pink text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Recovery code
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!useRecoveryCode && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Código TOTP</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field py-3 text-center tracking-[0.4em]"
                placeholder="123456"
                required
              />
            </div>
          )}

          {useRecoveryCode && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Código de recuperação</label>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                className="input-field py-3 text-center"
                placeholder="AB12-CD34"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (!useRecoveryCode && code.trim().length !== 6) || (useRecoveryCode && recoveryCode.trim() === '')}
            className={`btn-primary w-full py-3 text-lg shadow-md ${(isSubmitting || (!useRecoveryCode && code.trim().length !== 6) || (useRecoveryCode && recoveryCode.trim() === ''))
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-happy-blue hover:text-white'
              }`}
          >
            {isSubmitting ? 'Validando...' : 'Confirmar acesso'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <Link
            to="/login"
            onClick={() => {
              sessionStorage.removeItem('mfaToken');
              sessionStorage.removeItem('pendingMfaUser');
            }}
            className="text-happy-blue hover:underline"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MfaVerify;
