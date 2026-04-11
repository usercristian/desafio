import React, { useEffect } from 'react';
import { FaHeart, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductSidebar = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('sidebarOpen'));
    } else {
      window.dispatchEvent(new Event('sidebarClose'));
    }
  }, [isOpen]);

  if (!product) return null;

  return (
    <aside 
      className={`
        fixed bottom-4 right-4 w-full max-w-sm md:max-w-md 
        bg-white border border-happy-detail rounded-2xl shadow-2xl 
        z-[60] transform transition-all duration-300 ease-in-out
        flex flex-col max-h-[90vh]
        ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}
      `}
    >
      {/* Cabeçalho do Card (Estilo Chatbot) */}
      <div className="flex justify-between items-center bg-happy-pink text-white p-3 rounded-t-2xl">
        <h5 className="font-bold text-lg">Assistente Happy</h5>
        <button 
          onClick={onClose} 
          aria-label="Fechar painel de produto"
          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <FaTimes size={18} />
        </button>
      </div>

      {/* Conteúdo com Scroll se necessário */}
      <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-happy-blue scrollbar-track-gray-100 rounded-b-2xl">
        <div className="relative">
          {/* Botão de Favorito */}
          <button aria-label="Adicionar aos favoritos" className="absolute top-0 right-0 text-happy-pink hover:scale-110 transition-transform p-2 bg-transparent border-none cursor-pointer">
             <FaHeart size={22} />
          </button>

          {/* Imagem do Produto */}
          <img 
            src={product.image} 
            alt={product.nome} 
            className="w-full h-48 object-contain mb-4 p-2 bg-white rounded-lg"
          />
          
          <h4 className="text-xl font-bold text-center text-happy-text mb-1">
            {product.nome}
          </h4>
          
          <p className="text-center font-bold text-happy-blue-text text-sm mb-3">
            Avaliação: {product.rating}/5 ({product.numRatings} avaliações)
          </p>
          <p className="text-center font-bold text-happy-pink text-2xl mb-4">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>

          <hr className="border-happy-detail my-3" />

          <div className="space-y-3 text-sm text-gray-600 text-justify">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <h6 className="font-bold text-black mb-1 text-xs uppercase">Por que as pessoas compram</h6>
              <p className="leading-relaxed">Este é um item muito popular entre os jogadores que buscam performance e estilo. Ideal para quem quer melhorar o setup.</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <h6 className="font-bold text-black mb-1 text-xs uppercase">Descrição técnica</h6>
              <p className="leading-relaxed">Produto de alta durabilidade, conexão rápida e design ergonômico. Garantia de 1 ano pelo fabricante.</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3 shadow-lg shadow-happy-pink/30"
            >
              Comprar agora
            </button>
            <button 
              className="w-full bg-white border-2 border-gray-300 text-gray-600 font-bold py-2 rounded-lg hover:border-happy-blue hover:text-happy-blue transition-colors"
            >
              Salvar no carrinho
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;