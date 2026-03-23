import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const readStoredUser = () => {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error('Erro ao ler usuário salvo:', error);
    return null;
  }
};

const Security = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(readStoredUser);
  const [setupData, setSetupData] = useState(null);
  const [activationCode, setActivationCode] = useState('');
  const [regenPassword, setRegenPassword] = useState('');
  const [regenCode, setRegenCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [isStartingSetup, setIsStartingSetup] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');
  const isMfaEnabled = Boolean(user?.mfaEnabled);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const persistUser = (updates) => {
    const currentUser = readStoredUser() || {};
    const nextUser = { ...currentUser, ...updates };

    setUser(nextUser);
    localStorage.setItem('user', JSON.stringify(nextUser));
    window.dispatchEvent(new Event('storage'));
  };

  const handleStartSetup = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setRecoveryCodes([]);
    setIsStartingSetup(true);

    try {
      const response = await fetch('http://localhost:3001/auth/mfa/setup', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.message || data?.error || 'Não foi possível iniciar a configuração do MFA.');
        return;
      }

      setSetupData(data);
    } catch (error) {
      console.error('Erro ao iniciar configuração MFA:', error);
      setErrorMessage('Erro de conexão ao iniciar a configuração do MFA.');
    } finally {
      setIsStartingSetup(false);
    }
  };

  const handleActivateMfa = async (e) => {
    e.preventDefault();

    if (!token || activationCode.trim().length !== 6) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsActivating(true);

    try {
      const response = await fetch('http://localhost:3001/auth/mfa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: activationCode.trim()
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.message || 'Não foi possível ativar o MFA.');
        return;
      }

      persistUser({
        mfaEnabled: true,
        mfaEnabledAt: new Date().toISOString()
      });

      setRecoveryCodes(Array.isArray(data?.recoveryCodes) ? data.recoveryCodes : []);
      setActivationCode('');
      setSetupData(null);
      setSuccessMessage('MFA ativado com sucesso. Guarde os códigos de recuperação abaixo em um local seguro.');
    } catch (error) {
      console.error('Erro ao ativar MFA:', error);
      setErrorMessage('Erro de conexão ao ativar o MFA.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleRegenerateCodes = async (e) => {
    e.preventDefault();

    if (!token || !regenPassword.trim() || regenCode.trim().length !== 6) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsRegenerating(true);

    try {
      const response = await fetch('http://localhost:3001/auth/mfa/regenerate-recovery-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          password: regenPassword,
          code: regenCode.trim()
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.message || 'Não foi possível regenerar os recovery codes.');
        return;
      }

      setRecoveryCodes(Array.isArray(data?.recoveryCodes) ? data.recoveryCodes : []);
      setRegenPassword('');
      setRegenCode('');
      setSuccessMessage('Novos recovery codes gerados. Os códigos anteriores foram invalidados.');
    } catch (error) {
      console.error('Erro ao regenerar recovery codes:', error);
      setErrorMessage('Erro de conexão ao regenerar os recovery codes.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="bg-white rounded-[20px] shadow-[0_0_30px_rgba(5,217,232,0.08)] border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-happy-pink to-happy-blue text-white p-8">
          <p className="text-sm uppercase tracking-[0.25em] opacity-80 mb-2">Segurança da conta</p>
          <h1 className="text-3xl font-bold mb-2">Autenticação em duas etapas</h1>
          <p className="max-w-2xl text-sm md:text-base opacity-90">
            Proteja sua conta adicionando uma segunda etapa no login. Depois da ativação, o acesso exigirá o código do app autenticador ou um recovery code.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div>
              <h2 className="text-lg font-bold text-happy-text mb-1">Status atual</h2>
              <p className="text-gray-500 text-sm">
                {user?.email ? `Conta: ${user.email}` : 'Conta autenticada'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${isMfaEnabled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {isMfaEnabled ? 'MFA ativo' : 'MFA desativado'}
            </span>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-100 text-green-700 rounded-xl px-4 py-3 text-sm">
              {successMessage}
            </div>
          )}

          {!isMfaEnabled && !setupData && (
            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-happy-text mb-2">Ativar MFA</h2>
              <p className="text-gray-600 text-sm mb-5">
                Você vai precisar de um app autenticador no celular. Ao ativar, também receberá recovery codes para acessar a conta caso perca o dispositivo.
              </p>
              <button
                type="button"
                onClick={handleStartSetup}
                disabled={isStartingSetup}
                className={`btn-primary py-3 px-5 text-sm font-bold shadow-md ${isStartingSetup ? 'opacity-50 cursor-not-allowed' : 'hover:bg-happy-blue hover:text-white'}`}
              >
                {isStartingSetup ? 'Preparando QR Code...' : 'Ativar autenticação em duas etapas'}
              </button>
            </section>
          )}

          {!isMfaEnabled && setupData && (
            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-happy-text mb-2">Configure seu app autenticador</h2>
              <p className="text-gray-600 text-sm mb-6">
                1. Escaneie o QR Code abaixo. 2. Digite o código de 6 dígitos gerado no app para concluir a ativação.
              </p>

              <div className="grid md:grid-cols-[240px_1fr] gap-6 items-start">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-center">
                  <img
                    src={setupData.qrCodeDataUrl}
                    alt="QR Code para ativar MFA"
                    className="w-full max-w-[200px] h-auto"
                  />
                </div>

                <form onSubmit={handleActivateMfa} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Código de verificação</label>
                    <input
                      type="text"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="input-field py-3 text-center tracking-[0.4em]"
                      placeholder="123456"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isActivating || activationCode.trim().length !== 6}
                      className={`btn-primary py-3 px-5 text-sm font-bold shadow-md ${isActivating || activationCode.trim().length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-happy-blue hover:text-white'}`}
                    >
                      {isActivating ? 'Ativando...' : 'Confirmar ativação'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSetupData(null);
                        setActivationCode('');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="px-5 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {isMfaEnabled && (
            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-happy-text mb-2">MFA ativo</h2>
                <p className="text-gray-600 text-sm">
                  Sua conta já exige o código do app autenticador no login. Se precisar, gere uma nova lista de recovery codes abaixo.
                </p>
              </div>

              <form onSubmit={handleRegenerateCodes} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Senha atual</label>
                  <input
                    type="password"
                    value={regenPassword}
                    onChange={(e) => setRegenPassword(e.target.value)}
                    className="input-field py-3"
                    placeholder="Sua senha"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Código do app autenticador</label>
                  <input
                    type="text"
                    value={regenCode}
                    onChange={(e) => setRegenCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input-field py-3 text-center tracking-[0.4em]"
                    placeholder="123456"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isRegenerating || !regenPassword.trim() || regenCode.trim().length !== 6}
                    className={`btn-primary py-3 px-5 text-sm font-bold shadow-md ${isRegenerating || !regenPassword.trim() || regenCode.trim().length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-happy-blue hover:text-white'}`}
                  >
                    {isRegenerating ? 'Gerando novos códigos...' : 'Regenerar recovery codes'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {recoveryCodes.length > 0 && (
            <section className="bg-happy-bg border border-happy-blue/20 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-happy-text">Recovery codes</h2>
                  <p className="text-gray-600 text-sm">
                    Guarde estes códigos em um local seguro. Cada código pode ser usado uma única vez.
                  </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-happy-blue">
                  Visualização única
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {recoveryCodes.map((item) => (
                  <div
                    key={item}
                    className="bg-white border border-gray-100 rounded-xl px-4 py-3 font-mono text-center tracking-[0.2em] text-happy-text"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;
