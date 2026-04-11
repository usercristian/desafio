import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaCamera, FaCheckCircle } from 'react-icons/fa';

const Evaluation = () => {
  const navigate = useNavigate();
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

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Obrigado!</h2>
        <p className="text-gray-600 mb-6">Sua avaliação foi enviada com sucesso.</p>
        <button onClick={() => navigate('/')} className="btn-primary py-2 px-6">
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl flex-grow">
      <div className="bg-white rounded-xl shadow-card p-6 md:p-8 border border-gray-100">
        
        {/* Cabeçalho do Produto */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <img src="/images/Teclado.3.png" alt="Produto" className="w-32 h-32 object-contain border rounded-lg shadow-sm" />
          <div className="text-center md:text-left">
            <h3 className="font-bold text-gray-800 text-lg">{"Teclado gamer mecânico RAZER"}</h3>
            <h1 className="text-xl font-bold text-happy-text mt-1">Qual sua avaliação desta compra?</h1>
            
            {/* Estrelas Interativas */}
            <div className="flex justify-center md:justify-start gap-2 mt-3 text-3xl text-gray-300" role="radiogroup" aria-label="Avaliação em estrelas">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                  aria-pressed={rating >= star}
                  className={`transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-3xl focus-visible:ring-2 focus-visible:ring-happy-pink focus-visible:ring-offset-2 rounded ${
                    (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
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
            <label htmlFor="eval-photo" className="block font-bold text-gray-700 mb-2">Envie fotos do produto</label>
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-happy-blue rounded-xl cursor-pointer hover:bg-blue-50 transition-colors text-happy-blue-text font-bold gap-2">
              <FaCamera />
              <span>{files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : 'Adicionar fotos'}</span>
              <input type="file" id="eval-photo" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Comentário */}
          <div>
            <label htmlFor="eval-comment" className="block font-bold text-gray-700 mb-2">Escreva sua opinião</label>
            <textarea 
              id="eval-comment"
              className="input-field h-32 resize-none"
              placeholder="O que você achou do produto?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
            ></textarea>
            <div className="text-right text-xs text-gray-400">{comment.length}/1000</div>
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