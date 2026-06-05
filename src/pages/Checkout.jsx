import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h2 className="text-2xl font-bold text-happy-text dark:text-gray-100 mb-6">Confirmação de compra</h2>

      {/* Resumo de Valores */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card mb-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold dark:text-gray-100 mb-4">Revise e confirme</h3>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Produtos</span>
          <span className="font-bold text-happy-pink">R$ 710,00</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">Frete</span>
          <span className="text-green-600 dark:text-green-400 font-bold">Grátis</span>
        </div>
        <hr className="border-gray-100 dark:border-gray-700 my-3" />
        <div className="flex justify-between items-center text-xl font-bold">
          <span className="dark:text-gray-100">Total</span>
          <span className="text-happy-pink">R$ 845,00</span>
        </div>

        {/* Botão de Ação ou Mensagem de Sucesso */}
        <div className="mt-6 text-center">
          {!isConfirmed ? (
            <button
              onClick={handleConfirm}
              className="btn-primary w-full py-3 text-lg shadow-md"
            >
              Confirmar compra
            </button>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-fade-in">
              <div className="flex flex-col items-center text-green-700 dark:text-green-300 gap-2 mb-3">
                <FaCheckCircle size={40} />
                <p className="font-bold">Obrigado! Sua compra foi confirmada.</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-300 font-bold hover:underline text-sm"
              >
                Voltar às compras
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Detalhes de Entrega */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card mb-6 border border-gray-100 dark:border-gray-700">
        <h4 className="font-bold text-lg dark:text-gray-100 mb-3">Detalhes da entrega</h4>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
          <FaMapMarkerAlt className="text-happy-pink" />
          <p>Rua Conselheiro Saraiva, 281</p>
        </div>
        <button type="button" className="text-happy-pink text-sm hover:underline bg-transparent border-none cursor-pointer">
          Alterar endereço
        </button>

      </section>

      {/* Lista de Produtos */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700">
        <h4 className="font-bold text-lg dark:text-gray-100 mb-4">Produtos</h4>

        <div className="flex gap-4 mb-4">
          <img src="/images/Teclado.3.png" alt="Teclado gamer mecânico RAZER com teclas pretas" className="w-20 h-20 object-contain border dark:border-gray-600 rounded-md" />
          <div>
            <p className="font-bold text-sm dark:text-gray-100">Teclado gamer mecânico RAZER</p>
            <p className="text-happy-pink font-bold">R$ 320,00</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Qtd: 1</p>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-700 my-4" />

        <div className="flex gap-4">
          <img src="/images/Cadeira.3.png" alt="Cadeira ergonômica Home Office Preta com encosto de pescoço" className="w-20 h-20 object-contain border dark:border-gray-600 rounded-md" />
          <div>
            <p className="font-bold text-sm dark:text-gray-100">Cadeira ergonômica Home Office Preta com encosto de pescoço</p>
            <p className="text-happy-pink font-bold">R$ 390,00</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Qtd: 1</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;