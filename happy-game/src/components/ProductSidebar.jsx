import React from 'react';
import { FaHeart, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductSidebar = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!product) return null;

  // Classes para animação de entrada/saída
  const sidebarClasses = `fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] overflow-y-auto ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`;

  return (
    <>
      {/* Overlay escuro para focar na sidebar (opcional, melhora contraste) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="p-4">
          {/* Cabeçalho da Sidebar */}
          <div className="flex justify-between items-center bg-happy-pink text-white p-3 rounded-t-lg -mx-4 -mt-4 mb-4">
            <h5 className="font-bold text-lg">Assistente Happy</h5>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <FaTimes size={20} />
            </button>
          </div>

          {/* Corpo do Produto */}
          <div className="border border-happy-detail rounded-lg p-4 shadow-card relative">
            <button className="absolute top-4 right-4 text-happy-pink hover:scale-110 transition-transform">
               <FaHeart size={20} />
            </button>

            <img 
              src={product.image} 
              alt={product.nome} 
              className="w-full h-64 object-contain mb-4 rounded-md"
            />
            
            <h4 className="text-xl font-bold text-center text-happy-text mb-2">
              {product.nome}
            </h4>
            
            <p className="text-center font-bold text-happy-blue mb-4">
              Avaliação: {product.rating}/5 ({product.numRatings} avaliações)
            </p>
            <p className="text-center font-bold text-happy-pink text-xl mb-4">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>

            <hr className="border-gray-200 my-4" />

            <div className="space-y-4 text-sm text-gray-600 text-justify">
              <div>
                <h6 className="font-bold text-black mb-1">Por que as pessoas compram</h6>
                <p>Este é um item muito popular entre os jogadores que buscam performance e estilo. Ideal para quem quer melhorar o setup.</p>
              </div>
              
              <div>
                <h6 className="font-bold text-black mb-1">Descrição técnica</h6>
                <p>Produto de alta durabilidade, conexão rápida e design ergonômico. Garantia de 1 ano pelo fabricante.</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-happy-pink text-white font-bold py-3 rounded-lg hover:bg-happy-pink-dark transition-colors"
              >
                Comprar agora
              </button>
              <button 
                className="w-full bg-transparent border-2 border-gray-400 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Salvar no carrinho
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProductSidebar;