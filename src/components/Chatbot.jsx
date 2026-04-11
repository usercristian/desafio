import React, { useState, useRef, useEffect } from 'react';
import { FaMinus, FaPlus, FaPaperPlane } from 'react-icons/fa';
import { products } from '../data/productsData';

/**
 * Função auxiliar para calcular a nota ponderada (Weighted Rating).
 * Evita que produtos com poucas avaliações fiquem artificialmente no topo.
 */
const calculateWeightedRating = (product, minNumRatings, avgRatingAll) => {
  const v = product.numRatings;
  const m = minNumRatings;
  const R = product.rating;
  const C = avgRatingAll;
  // Fórmula Bayesiana para média ponderada
  return (v / (v + m)) * R + (m / (v + m)) * C;
};

const getSustainableAlternative = (product) => {
  if (!product?.alternativaSustentavelId) return null;
  return products.find((item) => item.id === product.alternativaSustentavelId);
};

const getSustainableListLabel = (product) => {
  if (product.sustentavel) {
    return ` [Sustentavel: ${product.embalagem}]`;
  }

  const alternative = getSustainableAlternative(product);
  return alternative ? ` [Similar de menor impacto: ${alternative.nome}]` : '';
};

const Chatbot = () => {
  // Estados de UI
  const [isOpen, setIsOpen] = useState(true); // Controla se o chat está maximizado ou minimizado
  const [isHidden, setIsHidden] = useState(false); // Controla se o chat está invisível (atrás da Sidebar)

  // Estados de Dados e Fluxo
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Sou o Assistente Happy. Para começar, digite o nome de uma categoria que você procura (ex: Mouses, Teclados, Cadeiras).",
      sender: 'bot'
    }
  ]);

  // Máquina de estados simples para o fluxo de conversa (INITIAL -> CHOICE -> CONFIRMATION)
  const [chatState, setChatState] = useState('INITIAL');
  const [listedProducts, setListedProducts] = useState([]);
  const [productInConfirmation, setProductInConfirmation] = useState(null);

  // Ref para scroll automático
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efeito para scrollar sempre que chegar nova mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  /**
   * Efeito para gerenciar conflito visual com a Sidebar de Produtos.
   * Quando a Sidebar abre, o Chatbot se esconde para não poluir a tela.
   */
  useEffect(() => {
    const handleHide = () => setIsHidden(true);
    const handleShow = () => setIsHidden(false);

    window.addEventListener('sidebarOpen', handleHide);
    window.addEventListener('sidebarClose', handleShow);

    // Cleanup: remove os listeners ao desmontar o componente
    return () => {
      window.removeEventListener('sidebarOpen', handleHide);
      window.removeEventListener('sidebarClose', handleShow);
    };
  }, []);

  /**
   * Lógica principal de resposta do Bot.
   * Processa a entrada do usuário baseada no estado atual da conversa.
   */
  const handleBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    let botResponse = [];

    switch (chatState) {
      case 'INITIAL':
        // Busca produtos que contenham a palavra-chave digitada
        const productsInCategory = products.filter(p =>
          p.keywords.some(k => lowerMsg.includes(k))
        );

        if (productsInCategory.length > 0) {
          // Configuração para o cálculo de ranking
          const m = 50; // Mínimo de votos para relevância
          const totalRating = products.reduce((acc, p) => acc + p.rating, 0);
          const C = totalRating / products.length; // Média global

          // Ordena do melhor para o pior
          const sortedProducts = [...productsInCategory].sort((a, b) =>
            calculateWeightedRating(b, m, C) - calculateWeightedRating(a, m, C)
          );

          setListedProducts(sortedProducts);

          // Monta a mensagem de lista
          let listText = `Encontrei estes itens em "${sortedProducts[0].categoria}". Qual deles te interessa?\n(Ordenado pelos mais bem avaliados)\n\n`;
          sortedProducts.forEach((p, index) => {
            listText += `${index + 1}. ${p.nome} (Nota: ${p.rating.toFixed(1)})${getSustainableListLabel(p)}\n`;
          });
          listText += `\nDigite o número do item.`;

          botResponse.push({ text: listText, sender: 'bot' });
          setChatState('AWAITING_PRODUCT_CHOICE');
        } else {
          botResponse.push({ text: "Não encontrei essa categoria. Tente 'mouses', 'teclados', etc.", sender: 'bot' });
        }
        break;

      case 'AWAITING_PRODUCT_CHOICE':
        const index = parseInt(lowerMsg) - 1;
        // Valida se o número digitado é válido
        if (!isNaN(index) && index >= 0 && index < listedProducts.length) {
          const selected = listedProducts[index];
          setProductInConfirmation(selected);

          botResponse.push({
            text: `Você escolheu: ${selected.nome}\n${selected.sustentavel ? 'Boa escolha: este item tem baixo impacto ambiental simulado.' : 'Dica ESG: confira abaixo uma alternativa similar com menor impacto, quando disponivel.'}`,
            sender: 'bot',
            isProductCard: true,
            product: selected
          });

          setChatState('AWAITING_PURCHASE_CONFIRMATION');
        } else {
          botResponse.push({ text: "Número inválido. Por favor, digite um dos números da lista acima.", sender: 'bot' });
        }
        break;

      case 'AWAITING_PURCHASE_CONFIRMATION':
        if (['sim', 's', 'yes'].includes(lowerMsg)) {
          botResponse.push({ text: `GG! Seu ${productInConfirmation.nome} foi adicionado ao carrinho virtual! (Simulação)`, sender: 'bot' });
          // Reseta para o estado inicial
          setChatState('INITIAL');
          setListedProducts([]);
          setProductInConfirmation(null);
        } else if (['não', 'nao', 'n', 'no'].includes(lowerMsg)) {
          botResponse.push({ text: "Ok. Se precisar de mais alguma coisa, é só chamar!", sender: 'bot' });
          setChatState('INITIAL');
        } else {
          botResponse.push({ text: "Não entendi. Digite 'Sim' para confirmar ou 'Não' para cancelar.", sender: 'bot' });
        }
        break;

      default:
        botResponse.push({ text: "Ocorreu um erro. Vamos começar de novo?", sender: 'bot' });
        setChatState('INITIAL');
    }

    if (botResponse.length > 0) {
      setMessages(prev => [...prev, ...botResponse]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simula um pequeno delay de pensamento do bot
    setTimeout(() => {
      handleBotResponse(userMsg.text);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    // Container Principal:
    // - 'fixed bottom-5 right-5': Posicionamento fixo
    // - Lógica 'isHidden': Move o chat para baixo e tira opacidade quando a Sidebar abre
    <div
      className={`
        fixed bottom-5 right-5 w-80 bg-white rounded-xl shadow-2xl z-40 
        transition-all duration-500 ease-in-out flex flex-col overflow-hidden border border-gray-200
        ${isOpen ? 'h-[400px]' : 'h-12'}
        ${isHidden ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
      `}
    >

      {/* Cabeçalho do Chat (Toggle Minimizar/Maximizar) */}
      <div
        className="bg-happy-pink text-white p-3 font-bold flex justify-between items-center cursor-pointer hover:bg-happy-pink-dark transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Assistente Happy</span>
        <button className="text-sm focus:outline-none">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </button>
      </div>

      {/* Corpo das Mensagens */}
      {isOpen && (
        <>
          <div className="flex-1 bg-gray-50 p-3 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end ml-auto items-end' : 'self-start items-start'}`}
              >
                {/* Balão de texto */}
                <div
                  className={`p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${msg.sender === 'user'
                    ? 'bg-happy-pink text-white rounded-tr-none'
                    : 'bg-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                >
                  {msg.text}
                </div>

                {/* Card de Produto Rico (dentro do chat) */}
                {msg.isProductCard && msg.product && (
                  <div className="mt-2 p-2 bg-white border border-happy-detail rounded-lg shadow-card w-full text-center">
                    <img src={msg.product.image} alt={msg.product.nome} className="w-16 h-16 object-contain mx-auto mb-2" />
                    <p className="text-xs font-bold text-happy-pink mb-1">Nota: {msg.product.rating}</p>
                    <div className="bg-green-50 border border-green-100 rounded-md p-2 mb-2 text-left">
                      <p className="text-[11px] font-bold text-green-800 mb-1">
                        {msg.product.sustentavel ? 'Baixo impacto ambiental' : 'Impacto ambiental moderado'}
                      </p>
                      <p className="text-[11px] text-green-900 leading-snug">
                        Embalagem: {msg.product.embalagem}
                      </p>
                      <p className="text-[11px] text-green-900 leading-snug mt-1">
                        Descarte: {msg.product.descarte}
                      </p>
                      {getSustainableAlternative(msg.product) && (
                        <p className="text-[11px] text-green-800 leading-snug mt-1">
                          Sugestao sustentavel: <strong>{getSustainableAlternative(msg.product).nome}</strong>
                        </p>
                      )}
                    </div>
                    <p className="text-xs mb-2">Adicionar ao carrinho?</p>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleBotResponse('sim')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-600"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => handleBotResponse('não')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600"
                      >
                        Não
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Elemento invisível para forçar scroll para o fim */}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de Input */}
          <div className="p-2 border-t border-gray-200 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite aqui..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-happy-pink focus:ring-1 focus:ring-happy-pink"
            />
            <button
              onClick={handleSend}
              className="bg-happy-pink text-white p-2 rounded-lg hover:bg-happy-pink-dark transition-colors"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
