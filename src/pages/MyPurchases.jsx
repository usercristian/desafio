import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaStar,
  FaTruck,
  FaRedoAlt,
  FaShoppingBag,
  FaExclamationTriangle,
  FaCheck,
} from 'react-icons/fa';
import {
  purchasesData,
  getStatusConfig,
  getDeliveryTimeline,
  availableStatuses,
} from '../data/purchasesData';

// ─── Skeleton Card (loading state) ──────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-card animate-pulse">
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
    </div>
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="flex-grow space-y-3 w-full">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
    <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-28" />
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-36" />
    </div>
  </div>
);

// ─── Empty State ────────────────────────────────────────────────
const EmptyState = ({ isFiltered, onClearFilter, navigate }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="bg-gray-50 dark:bg-gray-800 rounded-full p-6 mb-6">
      <FaShoppingBag className="text-5xl text-gray-300 dark:text-gray-600" />
    </div>
    {isFiltered ? (
      <>
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">
          Nenhum pedido encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          Não há pedidos com o filtro selecionado. Tente outro status ou limpe o filtro.
        </p>
        <button
          onClick={onClearFilter}
          className="btn-primary py-2 px-6"
        >
          Limpar filtro
        </button>
      </>
    ) : (
      <>
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">
          Você ainda não fez nenhuma compra
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          Explore nossos produtos e encontre os melhores itens gamer para o seu setup!
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary py-2 px-6"
        >
          Explorar produtos
        </button>
      </>
    )}
  </div>
);

// ─── Error State ────────────────────────────────────────────────
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-6 mb-6">
      <FaExclamationTriangle className="text-5xl text-red-400 dark:text-red-500" />
    </div>
    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">
      Ops! Algo deu errado
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
      Não foi possível carregar suas compras. Verifique sua conexão e tente novamente.
    </p>
    <button onClick={onRetry} className="btn-primary py-2 px-6">
      Tentar novamente
    </button>
  </div>
);

// ─── Status Badge ───────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`}
    >
      <Icon className="text-[10px]" />
      {config.label}
    </span>
  );
};

// ─── Delivery Timeline ─────────────────────────────────────────
const DeliveryTimeline = ({ status }) => {
  const steps = getDeliveryTimeline(status);
  if (status === 'Cancelado' || status === 'Entregue') return null;

  return (
    <div className="flex items-center gap-1 mt-3 flex-wrap">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <span
            className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
              step.active
                ? 'bg-happy-blue/10 text-happy-blue-text dark:text-happy-blue'
                : step.completed
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            {step.active ? `● ${step.label}` : step.label}
          </span>
          {i < steps.length - 1 && (
            <span className={`text-xs ${step.completed ? 'text-green-400 dark:text-green-600' : 'text-gray-300 dark:text-gray-700'}`}>
              →
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── Purchase Card ──────────────────────────────────────────────
const PurchaseCard = ({ item, navigate }) => {
  const [buyAgainFeedback, setBuyAgainFeedback] = useState(false);

  const handleBuyAgain = () => {
    setBuyAgainFeedback(true);
    setTimeout(() => {
      setBuyAgainFeedback(false);
      navigate('/checkout');
    }, 600);
  };

  return (
    <div
      role="listitem"
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-card hover:shadow-lg transition-shadow duration-300"
    >
      {/* ── Cabeçalho: Pedido + Data + Status ── */}
      <div className="flex flex-wrap justify-between items-center gap-2 px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
            Pedido {item.orderNumber}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {item.dateFormatted}
          </span>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {/* ── Corpo: Imagem + Detalhes ── */}
      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start px-6 py-5">
        <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-900/30 shrink-0">
          <img
            src={item.image}
            alt={item.product}
            className="w-28 h-28 object-contain"
          />
        </div>

        <div className="flex-grow text-center sm:text-left min-w-0">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1 leading-snug">
            {item.product}
          </h3>
          <p className="text-happy-pink font-bold text-xl mb-1">
            R$ {item.price.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Quantidade: {item.quantity}
          </p>

          {/* Timeline de entrega (para Em trânsito / Pendente) */}
          <DeliveryTimeline status={item.status} />

          {/* Código de rastreio */}
          {item.trackingCode && item.status !== 'Cancelado' && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Rastreio: <span className="font-mono font-bold text-gray-600 dark:text-gray-300">{item.trackingCode}</span>
            </p>
          )}
        </div>
      </div>

      {/* ── Rodapé: Ações ── */}
      <div className="flex flex-wrap gap-2 px-6 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700">
        {/* Avaliar — só para entregues que podem ser avaliados */}
        {item.status === 'Entregue' && item.canReview && (
          <button
            onClick={() =>
              navigate(`/evaluation/${item.productId}`, {
                state: { product: item },
              })
            }
            aria-label={`Avaliar: ${item.product}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-happy-pink focus-visible:ring-offset-2"
          >
            <FaStar className="text-xs" />
            Avaliar produto
          </button>
        )}

        {/* Rastrear — para Em trânsito com tracking code */}
        {item.status === 'Em trânsito' && item.trackingCode && (
          <button
            aria-label={`Rastrear pedido: ${item.product}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-happy-pink focus-visible:ring-offset-2"
          >
            <FaTruck className="text-xs" />
            Rastrear pedido
          </button>
        )}

        {/* Comprar novamente — para todos exceto cancelados */}
        {item.status !== 'Cancelado' && (
          <button
            onClick={handleBuyAgain}
            aria-label={`Comprar novamente: ${item.product}`}
            disabled={buyAgainFeedback}
            className={`inline-flex items-center gap-1.5 text-sm font-bold rounded-lg px-3 py-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-happy-pink focus-visible:ring-offset-2 ${
              buyAgainFeedback
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 scale-95'
                : 'text-happy-pink bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/40'
            }`}
          >
            {buyAgainFeedback ? (
              <>
                <FaCheck className="text-xs" />
                Adicionado!
              </>
            ) : (
              <>
                <FaRedoAlt className="text-xs" />
                Comprar novamente
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Filter Chips ───────────────────────────────────────────────
const FilterChips = ({ activeFilter, onFilterChange, counts }) => (
  <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filtrar por status">
    {availableStatuses.map((status) => {
      const isActive = activeFilter === status;
      const count = status === 'Todos' ? counts.total : (counts[status] || 0);
      return (
        <button
          key={status}
          role="tab"
          aria-selected={isActive}
          onClick={() => onFilterChange(status)}
          className={`inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-happy-pink focus-visible:ring-offset-2 ${
            isActive
              ? 'bg-happy-pink text-white border-happy-pink shadow-md scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-happy-pink hover:text-happy-pink dark:hover:text-happy-pink'
          }`}
        >
          {status}
          <span
            className={`text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {count}
          </span>
        </button>
      );
    })}
  </div>
);

// ─── Main Component ─────────────────────────────────────────────
const MyPurchases = () => {
  const navigate = useNavigate();
  const titleRef = useRef(null);

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Título da aba
  useEffect(() => {
    document.title = 'Minhas Compras | Happy Game';
  }, []);

  // Simula fetch de dados (substituir por API real)
  const fetchPurchases = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      try {
        setPurchases(purchasesData);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Filtragem
  const filteredPurchases =
    activeFilter === 'Todos'
      ? purchases
      : purchases.filter((p) => p.status === activeFilter);

  // Contagem por status para os chips
  const counts = {
    total: purchases.length,
    Entregue: purchases.filter((p) => p.status === 'Entregue').length,
    Pendente: purchases.filter((p) => p.status === 'Pendente').length,
    'Em trânsito': purchases.filter((p) => p.status === 'Em trânsito').length,
    Cancelado: purchases.filter((p) => p.status === 'Cancelado').length,
  };

  const handleFilterChange = (status) => {
    setActiveFilter(status);
  };

  // ── Render ──
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h2
        ref={titleRef}
        className="text-2xl font-bold text-happy-text dark:text-gray-100 mb-6 pl-2 border-l-4 border-happy-pink"
      >
        Minhas Compras
      </h2>

      {/* ── Loading ── */}
      {loading && (
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* ── Erro ── */}
      {!loading && error && <ErrorState onRetry={fetchPurchases} />}

      {/* ── Conteúdo ── */}
      {!loading && !error && (
        <>
          {/* Filtros — só mostra se há compras */}
          {purchases.length > 0 && (
            <>
              <FilterChips
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                counts={counts}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-live="polite">
                Mostrando{' '}
                <span className="font-bold text-gray-700 dark:text-gray-200">
                  {filteredPurchases.length}
                </span>{' '}
                de{' '}
                <span className="font-bold text-gray-700 dark:text-gray-200">
                  {purchases.length}
                </span>{' '}
                {purchases.length === 1 ? 'pedido' : 'pedidos'}
              </p>
            </>
          )}

          {/* Lista ou Empty State */}
          {filteredPurchases.length > 0 ? (
            <div className="space-y-6" role="list" aria-label="Lista de compras">
              {filteredPurchases.map((item) => (
                <PurchaseCard key={item.id} item={item} navigate={navigate} />
              ))}
            </div>
          ) : (
            <EmptyState
              isFiltered={activeFilter !== 'Todos'}
              onClearFilter={() => setActiveFilter('Todos')}
              navigate={navigate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MyPurchases;