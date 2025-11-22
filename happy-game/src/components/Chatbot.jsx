import React, { useState, useRef, useEffect } from 'react';
import { FaMinus, FaPlus, FaPaperPlane } from 'react-icons/fa';
import { products } from '../data/productsData';

// Função auxiliar para calcular a nota ponderada (Ranking)
const calculateWeightedRating = (product, minNumRatings, avgRatingAll) => {
  const v = product.numRatings;
  const m = minNumRatings;
  const R = product.rating;
  const C = avgRatingAll;
  return (v / (v + m)) * R + (m / (v + m)) * C;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true); // Estado minimizado/maximizado
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Olá! Sou o Assistente Happy. Para começar, digite o nome de uma categoria que você procura (ex: Mouses, Teclados, Cadeiras).", 
      sender: 'bot' 
    }
  ]);
  
  // Estados para controlar o fluxo da conversa (Lógica migrada do script.js)
  const [chatState, setChatState] = useState('INITIAL');
  const [listedProducts, setListedProducts] = useState([]);
  const [productInConfirmation, setProductInConfirmation] = useState(null);

  // Ref para scrollar automaticamente para o final
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Função principal de processamento (o "Cérebro" do bot)
  const handleBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    let botResponse = [];

    switch (chatState) {
      case 'INITIAL':
        // Procura produtos por palavra-chave
        const productsInCategory = products.filter(p => 
          p.keywords.some(k => lowerMsg.includes(k))
        );

        if (productsInCategory.length > 0) {
          // Lógica de Ordenação Matemática (Weighted Rating)
          const m = 50; 
          const totalRating = products.reduce((acc, p) => acc + p.rating, 0);
          const C = totalRating / products.length;

          const sortedProducts = [...productsInCategory].sort((a, b) => 
            calculateWeightedRating(b, m, C) - calculateWeightedRating(a, m, C)
          );

          setListedProducts(sortedProducts);
          
          // Constrói a mensagem de lista
          let listText = `Encontrei estes itens em "${sortedProducts[0].categoria}". Qual deles te interessa?\n(Ordenado pelos mais bem avaliados)\n\n`;
          sortedProducts.forEach((p, index) => {
            listText += `${index + 1}. ${p.nome} (Nota: ${p.rating.toFixed(1)})\n`;
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
        if (!isNaN(index) && index >= 0 && index < listedProducts.length) {
          const selected = listedProducts[index];
          setProductInConfirmation(selected);
          
          // Mensagem especial com Card de Produto
          botResponse.push({ 
            text: `Você escolheu: ${selected.nome}`, 
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
          // Reseta o fluxo
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

    // Adiciona as respostas do bot ao chat
    if (botResponse.length > 0) {
      setMessages(prev => [...prev, ...botResponse]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Adiciona mensagem do usuário
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simula delay de "digitando..."
    setTimeout(() => {
      handleBotResponse(userMsg.text);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={`fixed bottom-5 right-5 w-80 bg-white rounded-xl shadow-2xl z-40 transition-all duration-300 flex flex-col overflow-hidden border border-gray-200 ${isOpen ? 'h-[400px]' : 'h-12'}`}>
      
      {/* Header do Chat */}
      <div 
        className="bg-happy-pink text-white p-3 font-bold flex justify-between items-center cursor-pointer hover:bg-happy-pink-dark transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Assistente Happy</span>
        <button className="text-sm focus:outline-none">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </button>
      </div>

      {/* Área de Mensagens */}
      {isOpen && (
        <>
          <div className="flex-1 bg-gray-50 p-3 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end ml-auto items-end' : 'self-start items-start'}`}
              >
                {/* Balão de Mensagem */}
                <div 
                  className={`p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-happy-pink text-white rounded-tr-none' 
                      : 'bg-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Card Especial de Produto (se houver) */}
                {msg.isProductCard && msg.product && (
                  <div className="mt-2 p-2 bg-white border border-happy-detail rounded-lg shadow-card w-full text-center">
                    <img src={msg.product.image} alt={msg.product.nome} className="w-16 h-16 object-contain mx-auto mb-2"/>
                    <p className="text-xs font-bold text-happy-pink mb-1">Nota: {msg.product.rating}</p>
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
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
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