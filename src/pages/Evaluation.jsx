import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaStar, FaCamera, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { products } from '../data/productsData';

const Evaluation = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();

  // Buscar produto pelo ID da rota, fallback para location.state
  const product = products.find((p) => p.id === Number(productId))
    || location.state?.product
    || null;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      alert('Máximo de 3 fotos permitidas.');
      return;
    }
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  // Produto não encontrado
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-full p-6 mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-5xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Produto não encontrado</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Não foi possível identificar o produto para avaliação.</p>
        <button onClick={() => navigate('/my-purchases')} className="btn-primary py-2 px-6">
          Voltar às compras
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Obrigado!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Sua avaliação foi enviada com sucesso.</p>
        <button onClick={() => navigate('/my-purchases')} className="btn-primary py-2 px-6">
          Voltar às compras
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl flex-grow">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        
        {/* Cabeçalho do Produto */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <img src={product.image} alt={product.nome || product.product} className="w-32 h-32 object-contain border dark:border-gray-600 rounded-lg shadow-sm" />
          <div className="text-center md:text-left">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{product.nome || product.product}</h3>
            <h1 className="text-xl font-bold text-happy-text dark:text-gray-100 mt-1">Qual sua avaliação desta compra?</h1>
            
            {/* Estrelas Interativas */}
            <div className="flex justify-center md:justify-start gap-2 mt-3 text-3xl text-gray-300 dark:text-gray-600" role="radiogroup" aria-label="Avaliação em estrelas">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                  aria-pressed={rating >= star}
                  className={`transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-3xl focus-visible:ring-2 focus-visible:ring-happy-pink focus-visible:ring-offset-2 rounded ${
                    (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload de Foto */}
          <div>
            <label htmlFor="eval-photo" className="block font-bold text-gray-700 dark:text-gray-300 mb-2">Envie fotos do produto</label>
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-happy-blue rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-happy-blue-text dark:text-happy-blue font-bold gap-2">
              <FaCamera />
              <span>{files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : 'Adicionar fotos'}</span>
              <input type="file" id="eval-photo" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Comentário */}
          <div>
            <label htmlFor="eval-comment" className="block font-bold text-gray-700 dark:text-gray-300 mb-2">Escreva sua opinião</label>
            <textarea 
              id="eval-comment"
              className="input-field h-32 resize-none"
              placeholder="O que você achou do produto?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
            ></textarea>
            <div className="text-right text-xs text-gray-400 dark:text-gray-500">{comment.length}/1000</div>
          </div>

          <div className="text-center">
            <button 
              type="submit" 
              disabled={rating === 0}
              className={`btn-primary w-full py-3 text-lg shadow-md ${rating === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-happy-blue hover:text-white'}`}
            >
              Publicar opinião
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Evaluation;