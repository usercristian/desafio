import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Contexto do carrinho de compras.
 * Centraliza itens, endereço e pagamento para eliminar dados hardcoded do Checkout.
 */
const CartContext = createContext(null);

// Itens padrão (compatibilidade com o fluxo existente)
const defaultItems = [
  {
    id: 1,
    productId: 3,
    name: 'Teclado gamer mecânico RAZER',
    image: '/images/Teclado.3.png',
    price: 320.00,
    quantity: 1,
  },
  {
    id: 2,
    productId: 9,
    name: 'Cadeira ergonômica Home Office Preta com encosto de pescoço',
    image: '/images/Cadeira.3.png',
    price: 390.00,
    quantity: 1,
  },
];

const defaultAddress = {
  street: 'Rua Conselheiro Saraiva',
  number: '281',
  neighborhood: 'Centro',
  city: 'Salvador',
  state: 'BA',
  zip: '40015-000',
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(defaultItems);
  const [address, setAddress] = useState(defaultAddress);
  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'card' | 'boleto'

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const getShipping = useCallback(() => {
    // Frete grátis para compras acima de R$ 200
    return getSubtotal() >= 200 ? 0 : 29.90;
  }, [getSubtotal]);

  const getTotal = useCallback(() => {
    return getSubtotal() + getShipping();
  }, [getSubtotal, getShipping]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, id: Date.now(), quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateAddress = useCallback((newAddress) => {
    setAddress((prev) => ({ ...prev, ...newAddress }));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = {
    items,
    address,
    paymentMethod,
    setPaymentMethod,
    getSubtotal,
    getShipping,
    getTotal,
    addItem,
    removeItem,
    updateAddress,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export default CartContext;
