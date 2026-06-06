import React, { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaStar, FaCamera, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaTimes, FaSpinner } from 'react-icons/fa';
import { products } from '../data/productsData';

// Labels descritivas para cada nível de estrela
const STAR_LABELS = {
  1: 'Péssimo',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente',
};

const Evaluation = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // Buscar produto pelo ID da rota, fallback para location.state
  const product = products.find((p) => p.id === Number(productId))
    || location.state?.product
    || null;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [fileError, setFileError] = useState('');

  // Gera previews para as imagens selecionadas
  const generatePreviews = (fileList) => {
    const urls = fileList.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      setFileError('Máximo de 3 fotos permitidas.');
      // Reset o input
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validar tamanho (máximo 5MB por arquivo)
    const oversized = selectedFiles.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setFileError('Cada foto deve ter no máximo 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFileError('');
    setFiles(selectedFiles);
    generatePreviews(selectedFiles);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // Revogar URL do preview removido
    URL.revokeObjectURL(previews[index]);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    // Reset input para permitir re-selecionar o mesmo arquivo
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    // Simula envio para API com delay
    setTimeout(() => {
      // Simula sucesso (em produção, seria uma chamada real de API)
      const success = true; // Alterar para false para testar erro
      if (success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        setIsSubmitting(false);
        setSubmitError(true);
      }
    }, 1500);
  };

  const handleRetrySubmit = () => {
    setSubmitError(false);
    handleSubmit({ preventDefault: () => {} });
  };

  // Label ativa baseada no hover ou na seleção
  const activeLabel = STAR_LABELS[hoverRating] || STAR_LABELS[rating] || null;

  // Produto não encontrado
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-full p-6 mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-5xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Produto não encontrado</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Não foi possível identificar o produto para avaliação.</p>
        <button 
          onClick={() => navigate('/my-purchases')} 
          className="btn-primary py-2 px-6"
          aria-label="Voltar para a página de compras"
        >
          Voltar às compras
        </button>
      </div>
    );
  }

  // Tela de sucesso
  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center animate-fade-in">
        <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-bounce-once" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Obrigado!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Sua avaliação foi enviada com sucesso.</p>
        <button 
          onClick={() => navigate('/my-purchases')} 
          className="btn-primary py-2 px-6"
          aria-label="Voltar para a página de compras"
        >
          Voltar às compras
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl flex-grow">

      {/* Breadcrumb / Link de retorno */}
      <button
        onClick={() => navigate('/my-purchases')}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-happy-pink dark:hover:text-happy-pink transition-colors mb-6 bg-transparent border-none cursor-pointer"
        aria-label="Voltar para Minhas Compras"
      >
        <FaArrowLeft className="text-xs" />
        Voltar para Minhas Compras
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        
        {/* Cabeçalho do Produto */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <img src={product.image} alt={product.nome || product.product} className="w-32 h-32 object-contain border dark:border-gray-600 rounded-lg shadow-sm" />
          <div className="text-center md:text-left">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{product.nome || product.product}</h2>
            <h1 className="text-xl font-bold text-happy-text dark:text-gray-100 mt-1">Qual sua avaliação desta compra?</h1>
            
            {/* Estrelas Interativas */}
            <div className="flex justify-center md:justify-start gap-2 mt-3 text-3xl text-gray-300 dark:text-gray-600" role="radiogroup" aria-label="Avaliação em estrelas">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} estrela${star > 1 ? 's' : ''} — ${STAR_LABELS[star]}`}
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

            {/* Label descritiva da nota */}
            <div className="h-6 mt-1">
              {activeLabel && (
                <span className={`text-sm font-bold animate-fade-in ${
                  (hoverRating || rating) >= 4 ? 'text-green-600 dark:text-green-400' :
                  (hoverRating || rating) >= 3 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-500 dark:text-red-400'
                }`}>
                  {activeLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload de Foto */}
          <div>
            <label htmlFor="eval-photo" className="block font-bold text-gray-700 dark:text-gray-300 mb-2">Envie fotos do produto</label>
            <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors font-bold gap-2 ${
              files.length > 0
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'border-happy-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 text-happy-blue-text dark:text-happy-blue'
            }`}>
              {files.length > 0 ? <FaCheckCircle /> : <FaCamera />}
              <span>{files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : 'Adicionar fotos'}</span>
              <input 
                type="file" 
                id="eval-photo" 
                ref={fileInputRef}
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Máximo 3 fotos, até 5MB cada</p>

            {/* Mensagem de erro de arquivo (inline, sem alert) */}
            {fileError && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-2 font-bold animate-fade-in" role="alert">
                {fileError}
              </p>
            )}

            {/* Thumbnails de preview */}
            {previews.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previews.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={url} 
                      alt={`Preview ${idx + 1}`} 
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      aria-label={`Remover foto ${idx + 1}`}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 border-none cursor-pointer shadow-md"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          {/* Erro no envio */}
          {submitError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-fade-in" role="alert">
              <p className="text-red-700 dark:text-red-300 font-bold text-sm mb-2">Não foi possível enviar sua avaliação.</p>
              <button
                type="button"
                onClick={handleRetrySubmit}
                className="text-red-600 dark:text-red-400 font-bold text-sm hover:underline bg-transparent border-none cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          )}

          <div className="text-center">
            {/* Mensagem quando botão está desabilitado */}
            {rating === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                Selecione uma avaliação em estrelas para continuar
              </p>
            )}
            <button 
              type="submit" 
              disabled={rating === 0 || isSubmitting}
              className={`btn-primary w-full py-3 text-lg shadow-md inline-flex items-center justify-center gap-2 ${
                rating === 0 || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-happy-blue hover:text-white'
              }`}
              aria-label={isSubmitting ? 'Enviando avaliação...' : 'Publicar opinião sobre o produto'}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Enviando...
                </>
              ) : (
                'Publicar opinião'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Evaluation;