// Dados simulados de compras — estrutura enriquecida para UX
// Quando uma API real for integrada, substituir a fonte de dados aqui.

import { FaCheckCircle, FaTruck, FaClock, FaTimesCircle } from 'react-icons/fa';

/**
 * Retorna configuração visual para cada status de pedido.
 * Centraliza a lógica de cores/ícones para não poluir os dados.
 */
export const getStatusConfig = (status) => {
  const configs = {
    'Entregue': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      darkBg: 'dark:bg-green-900/40',
      darkText: 'dark:text-green-300',
      icon: FaCheckCircle,
      label: 'Entregue',
    },
    'Pendente': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      darkBg: 'dark:bg-yellow-900/40',
      darkText: 'dark:text-yellow-300',
      icon: FaClock,
      label: 'Pendente',
    },
    'Em trânsito': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      darkBg: 'dark:bg-blue-900/40',
      darkText: 'dark:text-blue-300',
      icon: FaTruck,
      label: 'Em trânsito',
    },
    'Cancelado': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      darkBg: 'dark:bg-red-900/40',
      darkText: 'dark:text-red-300',
      icon: FaTimesCircle,
      label: 'Cancelado',
    },
  };

  return configs[status] || configs['Pendente'];
};

/**
 * Etapas da timeline de entrega por status.
 */
export const getDeliveryTimeline = (status) => {
  const steps = ['Confirmado', 'Enviado', 'Em trânsito', 'Entregue'];
  const activeIndex = {
    'Pendente': 0,
    'Em trânsito': 2,
    'Entregue': 3,
    'Cancelado': -1,
  };

  return steps.map((step, i) => ({
    label: step,
    completed: i <= (activeIndex[status] ?? -1),
    active: i === (activeIndex[status] ?? -1),
  }));
};

/**
 * Lista de status disponíveis para os filtros
 */
export const availableStatuses = ['Todos', 'Entregue', 'Pendente', 'Em trânsito', 'Cancelado'];

/**
 * Dados simulados de compras/pedidos
 */
export const purchasesData = [
  {
    id: 1,
    orderNumber: 'HG-2025-00471',
    date: '2025-10-10',
    dateFormatted: '10/10/2025',
    product: 'Teclado gamer mecânico RAZER',
    productId: 3,
    image: '/images/Teclado.3.png',
    price: 320.00,
    quantity: 1,
    status: 'Entregue',
    trackingCode: 'BR987654321XX',
    deliveredDate: '15/10/2025',
    canReview: true,
  },
  {
    id: 2,
    orderNumber: 'HG-2025-00392',
    date: '2025-09-04',
    dateFormatted: '04/09/2025',
    product: 'Cadeira ergonômica para Home Office',
    productId: 9,
    image: '/images/Cadeira.3.png',
    price: 390.00,
    quantity: 1,
    status: 'Em trânsito',
    trackingCode: 'BR123456789XX',
    deliveredDate: null,
    canReview: false,
  },
  {
    id: 3,
    orderNumber: 'HG-2025-00288',
    date: '2025-07-22',
    dateFormatted: '22/07/2025',
    product: 'Mouse Gamer Logitech',
    productId: 21,
    image: '/images/Mouse.3 (2).png',
    price: 249.90,
    quantity: 1,
    status: 'Pendente',
    trackingCode: null,
    deliveredDate: null,
    canReview: false,
  },
  {
    id: 4,
    orderNumber: 'HG-2025-00145',
    date: '2025-05-11',
    dateFormatted: '11/05/2025',
    product: 'Headset JBL Quantum',
    productId: 27,
    image: '/images/Fone.3.png',
    price: 289.90,
    quantity: 1,
    status: 'Cancelado',
    trackingCode: null,
    deliveredDate: null,
    canReview: false,
  },
];
