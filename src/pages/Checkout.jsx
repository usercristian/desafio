import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaCreditCard,
  FaBarcode,
  FaQrcode,
  FaShoppingBag,
  FaArrowRight,
  FaShieldAlt,
} from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';

// ─── Formatação de moeda ────────────────────────────────────────
const formatCurrency = (value) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

// ─── Etapas do Checkout (Breadcrumb) ────────────────────────────
const STEPS = ['Carrinho', 'Entrega', 'Pagamento', 'Confirmação'];

const StepsBreadcrumb = ({ currentStep }) => (
  <nav aria-label="Etapas da compra" className="mb-8">
    <ol className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        return (
          <li key={step} className="flex items-center gap-1 sm:gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full transition-all ${
                isActive
                  ? 'bg-happy-pink text-white shadow-md'
                  : isCompleted
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }`}
            >
              {isCompleted ? <FaCheckCircle className="text-[10px]" /> : null}
              <span className="hidden sm:inline">{step}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </span>
            {idx < STEPS.length - 1 && (
              <FaArrowRight className={`text-[10px] ${isCompleted ? 'text-green-400' : 'text-gray-300 dark:text-gray-600'}`} />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

// ─── Opções de Pagamento ────────────────────────────────────────
const PAYMENT_OPTIONS = [
  { id: 'pix', label: 'PIX', icon: FaQrcode, desc: 'Aprovação imediata' },
  { id: 'card', label: 'Cartão de crédito', icon: FaCreditCard, desc: 'Até 12x sem juros' },
  { id: 'boleto', label: 'Boleto bancário', icon: FaBarcode, desc: '3 dias úteis para compensar' },
];

// ─── Modal de Confirmação ───────────────────────────────────────
const ConfirmationModal = ({ onConfirm, onCancel, total, isProcessing }) => (
  <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Confirmar compra">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full animate-scale-in border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold dark:text-gray-100 mb-3 text-center">Confirmar compra?</h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-2">
        Você será cobrado no valor de
      </p>
      <p className="text-2xl font-bold text-happy-pink text-center mb-6">
        {formatCurrency(total)}
      </p>

      {isProcessing ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <FaSpinner className="text-happy-pink text-3xl animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">Processando seu pedido...</p>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cancelar confirmação"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-primary py-2.5 text-center"
            aria-label="Confirmar compra definitivamente"
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  </div>
);

// ─── Modal de Endereço ──────────────────────────────────────────
const AddressModal = ({ address, onSave, onClose }) => {
  const [form, setForm] = useState({ ...address });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Alterar endereço">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full animate-scale-in border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold dark:text-gray-100">Alterar endereço</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-transparent border-none cursor-pointer p-1"
            aria-label="Fechar modal de endereço"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="addr-street" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Rua</label>
            <input id="addr-street" type="text" value={form.street} onChange={handleChange('street')} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="addr-number" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Número</label>
              <input id="addr-number" type="text" value={form.number} onChange={handleChange('number')} className="input-field" required />
            </div>
            <div>
              <label htmlFor="addr-zip" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CEP</label>
              <input id="addr-zip" type="text" value={form.zip} onChange={handleChange('zip')} className="input-field" required />
            </div>
          </div>
          <div>
            <label htmlFor="addr-neighborhood" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Bairro</label>
            <input id="addr-neighborhood" type="text" value={form.neighborhood} onChange={handleChange('neighborhood')} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="addr-city" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
              <input id="addr-city" type="text" value={form.city} onChange={handleChange('city')} className="input-field" required />
            </div>
            <div>
              <label htmlFor="addr-state" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <input id="addr-state" type="text" value={form.state} onChange={handleChange('state')} className="input-field" required />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary py-2.5 text-center">
              Salvar endereço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Tela de Sucesso ────────────────────────────────────────────
const SuccessScreen = ({ orderNumber, items, total, navigate }) => (
  <div className="container mx-auto px-4 py-10 max-w-2xl">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-8 border border-gray-100 dark:border-gray-700 text-center animate-fade-in">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4 animate-bounce-once" />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Pedido confirmado!</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-1">Obrigado pela sua compra</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
        Pedido <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{orderNumber}</span>
      </p>

      {/* Resumo dos itens */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
        <h2 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3">Resumo do pedido</h2>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 mb-2 last:mb-0">
            <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded border dark:border-gray-700" />
            <span className="text-sm dark:text-gray-300 flex-1">{item.name}</span>
            <span className="text-sm font-bold text-happy-pink">{formatCurrency(item.price)}</span>
          </div>
        ))}
        <hr className="border-gray-200 dark:border-gray-700 my-3" />
        <div className="flex justify-between text-lg font-bold">
          <span className="dark:text-gray-100">Total</span>
          <span className="text-happy-pink">{formatCurrency(total)}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Previsão de entrega: <span className="font-bold text-gray-700 dark:text-gray-300">5 a 8 dias úteis</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate('/my-purchases')}
          className="btn-primary py-2.5 px-6 inline-flex items-center justify-center gap-2"
          aria-label="Ver meus pedidos"
        >
          <FaShoppingBag className="text-sm" />
          Ver meus pedidos
        </button>
        <button
          onClick={() => navigate('/')}
          className="py-2.5 px-6 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Continuar comprando"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  </div>
);

// ─── Componente Principal ───────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const { items, address, paymentMethod, setPaymentMethod, getSubtotal, getShipping, getTotal, updateAddress } = useCart();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderNumber] = useState(() => `HG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`);

  // Título da aba
  useEffect(() => {
    document.title = 'Checkout | Happy Game';
  }, []);

  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    setIsProcessing(true);
    // Simula processamento do pedido
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmModal(false);
      setIsConfirmed(true);
    }, 2000);
  };

  const handleSaveAddress = (newAddress) => {
    updateAddress(newAddress);
    setShowAddressModal(false);
  };

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const selectedPayment = PAYMENT_OPTIONS.find((p) => p.id === paymentMethod);

  // Tela de sucesso dedicada
  if (isConfirmed) {
    return <SuccessScreen orderNumber={orderNumber} items={items} total={total} navigate={navigate} />;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-happy-text dark:text-gray-100 mb-2">Confirmação de compra</h1>

      {/* Breadcrumb de etapas */}
      <StepsBreadcrumb currentStep={3} />

      {/* ── Resumo de Valores ── */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card mb-6 border border-gray-100 dark:border-gray-700" aria-label="Resumo de valores">
        <h2 className="text-lg font-bold dark:text-gray-100 mb-4">Revise e confirme</h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Produtos ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
          <span className="font-bold text-happy-pink">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">Frete</span>
          <span className={`font-bold ${shipping === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {shipping === 0 ? 'Grátis' : formatCurrency(shipping)}
          </span>
        </div>
        <hr className="border-gray-100 dark:border-gray-700 my-3" />
        <div className="flex justify-between items-center text-xl font-bold">
          <span className="dark:text-gray-100">Total</span>
          <span className="text-happy-pink">{formatCurrency(total)}</span>
        </div>

        {/* Botão de confirmação */}
        <div className="mt-6 text-center">
          <button
            onClick={handleConfirmClick}
            className="btn-primary w-full py-3 text-lg shadow-md inline-flex items-center justify-center gap-2"
            aria-label="Confirmar compra"
            id="confirm-purchase-btn"
          >
            <FaShieldAlt className="text-sm" />
            Confirmar compra
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center justify-center gap-1">
            <FaShieldAlt className="text-[10px]" />
            Pagamento 100% seguro
          </p>
        </div>
      </section>

      {/* ── Forma de Pagamento ── */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card mb-6 border border-gray-100 dark:border-gray-700" aria-label="Forma de pagamento">
        <h2 className="font-bold text-lg dark:text-gray-100 mb-4">Forma de pagamento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Selecionar forma de pagamento">
          {PAYMENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = paymentMethod === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Pagar com ${option.label}`}
                onClick={() => setPaymentMethod(option.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-transparent ${
                  isSelected
                    ? 'border-happy-pink bg-pink-50 dark:bg-pink-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-happy-pink/50'
                }`}
              >
                <Icon className={`text-2xl ${isSelected ? 'text-happy-pink' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className={`text-sm font-bold ${isSelected ? 'text-happy-pink' : 'text-gray-700 dark:text-gray-300'}`}>
                  {option.label}
                </span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">{option.desc}</span>
              </button>
            );
          })}
        </div>
        {selectedPayment && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Pagamento via <span className="font-bold text-gray-700 dark:text-gray-200">{selectedPayment.label}</span> — {selectedPayment.desc}
          </p>
        )}
      </section>

      {/* ── Detalhes de Entrega ── */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card mb-6 border border-gray-100 dark:border-gray-700" aria-label="Detalhes de entrega">
        <h2 className="font-bold text-lg dark:text-gray-100 mb-3">Detalhes da entrega</h2>
        <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300 mb-1">
          <FaMapMarkerAlt className="text-happy-pink mt-1 shrink-0" />
          <div>
            <p className="font-bold">{address.street}, {address.number}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{address.neighborhood} — {address.city}/{address.state}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">CEP: {address.zip}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAddressModal(true)}
          className="text-happy-pink text-sm hover:underline bg-transparent border-none cursor-pointer font-bold mt-2"
          aria-label="Alterar endereço de entrega"
        >
          Alterar endereço
        </button>
      </section>

      {/* ── Lista de Produtos ── */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700" aria-label="Produtos no carrinho">
        <h2 className="font-bold text-lg dark:text-gray-100 mb-4">Produtos</h2>

        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            {idx > 0 && <hr className="border-gray-100 dark:border-gray-700 my-4" />}
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-contain border dark:border-gray-600 rounded-md self-center sm:self-start"
              />
              <div className="text-center sm:text-left">
                <p className="font-bold text-sm dark:text-gray-100">{item.name}</p>
                <p className="text-happy-pink font-bold">{formatCurrency(item.price)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Qtd: {item.quantity}</p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </section>

      {/* ── Modais ── */}
      {showConfirmModal && (
        <ConfirmationModal
          total={total}
          isProcessing={isProcessing}
          onConfirm={handleFinalConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {showAddressModal && (
        <AddressModal
          address={address}
          onSave={handleSaveAddress}
          onClose={() => setShowAddressModal(false)}
        />
      )}
    </div>
  );
};

export default Checkout;