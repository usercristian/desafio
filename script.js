// BANCO DE DADOS SIMPLIFICADO DE PRODUTOS
// Refatorado para sistema de Avaliação (1-5 estrelas)
// 'rating' é a média de estrelas (ex: 4.5)
// 'numRatings' é o número de avaliações (ex: 150)
// -------------------------------------------------

const listaDeProdutos = [
    // Teclados
    { nome: 'Teclado Mecânico', categoria: 'Teclados', image: 'images/teclado.webp', keywords: ['teclado', 'teclados'], rating: 4.2, numRatings: 90 },
    { nome: 'Teclado Gamer RGB', categoria: 'Teclados', image: 'images/Teclado.2.png', keywords: ['teclado', 'teclados'], rating: 4.8, numRatings: 250 },
    { nome: 'Teclado Compacto', categoria: 'Teclados', image: 'images/Teclado.3.png', keywords: ['teclado', 'teclados'], rating: 4.0, numRatings: 30 },
    // Cadeiras
    { nome: 'Cadeira Gamer Rosa', categoria: 'Cadeiras', image: 'images/cadeira.jpg', keywords: ['cadeira', 'cadeiras'], rating: 4.6, numRatings: 310 },
    { nome: 'Cadeira Fortrek', categoria: 'Cadeiras', image: 'images/Cadeira.2.png', keywords: ['cadeira', 'cadeiras'], rating: 4.3, numRatings: 120 },
    { nome: 'Cadeira Preta', categoria: 'Cadeiras', image: 'images/Cadeira.3.png', keywords: ['cadeira', 'cadeiras'], rating: 4.1, numRatings: 75 },
    // Mesas
    { nome: 'Mesa Gamer com Prateleiras', categoria: 'Mesas', image: 'images/mesagamer.jpg', keywords: ['mesa', 'mesas'], rating: 4.5, numRatings: 110 },
    { nome: 'Mesa em L', categoria: 'Mesas', image: 'images/Mesa.2.png', keywords: ['mesa', 'mesas'], rating: 4.0, numRatings: 45 },
    { nome: 'Mesa de Madeira', categoria: 'Mesas', image: 'images/Mesa.3.png', keywords: ['mesa', 'mesas'], rating: 4.7, numRatings: 60 },
    // Mouses
    { nome: 'Mouse Ultra Light', categoria: 'Mouses', image: 'images/mouse.jpg', keywords: ['mouse', 'mouses'], rating: 4.4, numRatings: 450 },
    { nome: 'Mouse Razer Edição', categoria: 'Mouses', image: 'images/mouserazer.webp', keywords: ['mouse', 'mouses'], rating: 4.9, numRatings: 320 },
    { nome: 'Mouse Gamer Logitech', categoria: 'Mouses', image: 'images/Mouse.3 (2).png', keywords: ['mouse', 'mouses'], rating: 4.7, numRatings: 510 },
    // Fones
    { nome: 'Fone RGB 7.1', categoria: 'Fones (Headsets)', image: 'images/fone1.webp', keywords: ['fone', 'fones', 'headset', 'headsets'], rating: 4.3, numRatings: 180 },
    { nome: 'Headset Havit', categoria: 'Fones (Headsets)', image: 'images/Fone.2.png', keywords: ['fone', 'fones', 'headset', 'headsets'], rating: 3.9, numRatings: 210 },
    { nome: 'Headset JBL Quantum', categoria: 'Fones (Headsets)', image: 'images/Fone.3.png', keywords: ['fone', 'fones', 'headset', 'headsets'], rating: 4.6, numRatings: 290 },
    // Monitores
    { nome: 'Monitor 27" 144hz', categoria: 'Monitores', image: 'images/Monitor.png', keywords: ['monitor', 'monitores'], rating: 4.5, numRatings: 85 },
    { nome: 'Monitor LG UltraGear 24"', categoria: 'Monitores', image: 'images/Monitor.2.png', keywords: ['monitor', 'monitores'], rating: 4.8, numRatings: 190 },
    { nome: 'Monitor Alltek 21"', categoria: 'Monitores', image: 'images/Monitor.3.png', keywords: ['monitor', 'monitores'], rating: 3.8, numRatings: 50 },
    // Acessórios
    { nome: 'Kit Mousepad Extenso', categoria: 'Acessórios', image: 'images/conjunto.webp', keywords: ['acessorio', 'acessorios', 'mousepad'], rating: 4.7, numRatings: 130 },
    { nome: 'Suporte Monitor USB', categoria: 'Acessórios', image: 'images/suporte.jpg', keywords: ['acessorio', 'acessorios', 'suporte'], rating: 4.2, numRatings: 65 },
    { nome: 'Mousepad Ergonômico', categoria: 'Acessórios', image: 'images/mousepad.jpg', keywords: ['acessorio', 'acessorios', 'mousepad'], rating: 3.5, numRatings: 25 },

    // ==========================================================
    // PRODUTOS ATUALIZADOS (ANTES 'PENDENTE')
    // ==========================================================

    { nome: 'Teclado Logi', categoria: 'Teclados', image: 'images/teclado4.webp', keywords: ['teclado', 'teclados'], rating: 4.1, numRatings: 15 },
    { nome: 'Teclado Rosa', categoria: 'Teclados', image: 'images/teclado5.webp', keywords: ['teclado', 'teclados'], rating: 4.3, numRatings: 25 },
    { nome: 'Teclado Branco', categoria: 'Teclados', image: 'images/teclado6.webp', keywords: ['teclado', 'teclados'], rating: 3.9, numRatings: 10 },

    { nome: 'Cadeira Ergo', categoria: 'Cadeiras', image: 'images/cadeira4.webp', keywords: ['cadeira', 'cadeiras'], rating: 4.0, numRatings: 30 },
    { nome: 'Cadeira Office', categoria: 'Cadeiras', image: 'images/cadeira5.webp', keywords: ['cadeira', 'cadeiras'], rating: 4.2, numRatings: 12 },
    { nome: 'Cadeira Azul', categoria: 'Cadeiras', image: 'images/cadeira6.webp', keywords: ['cadeira', 'cadeiras'], rating: 4.4, numRatings: 20 },

    { nome: 'Mesa Gamer Z', categoria: 'Mesas', image: 'images/mesa4.webp', keywords: ['mesa', 'mesas'], rating: 4.5, numRatings: 18 },
    { nome: 'Mesa Gamer L', categoria: 'Mesas', image: 'images/mesa5.webp', keywords: ['mesa', 'mesas'], rating: 4.1, numRatings: 22 },
    { nome: 'Mesa Simples', categoria: 'Mesas', image: 'images/mesa6.webp', keywords: ['mesa', 'mesas'], rating: 3.8, numRatings: 40 },
    
    { nome: 'Mouse Ergo', categoria: 'Mouses', image: 'images/mouse4.webp', keywords: ['mouse', 'mouses'], rating: 4.6, numRatings: 35 },
    { nome: 'Mouse Básico', categoria: 'Mouses', image: 'images/mouse5.webp', keywords: ['mouse', 'mouses'], rating: 4.3, numRatings: 28 },
    { nome: 'Mouse Logi', categoria: 'Mouses', image: 'images/mouse6.webp', keywords: ['mouse', 'mouses'], rating: 4.0, numRatings: 15 },

    { nome: 'Headset Branco', categoria: 'Fones (Headsets)', image: 'images/fone4.webp', keywords: ['fone', 'fones', 'headset', 'headsets'], rating: 3.9, numRatings: 45 },
    { nome: 'Headset Logi', categoria: 'Fones (Headsets)', image: 'images/fone5.webp', keywords: ['fone', 'fones', 'headset', 'headsets'], rating: 4.1, numRatings: 33 },
    { nome: 'Headset Rosa', categoria: 'Fones (Headsets)', image: 'images/fone6.webp', keywords: ['fone', 'fones', 'headset', 'headsets'], rating: 4.2, numRatings: 24 },

    { nome: 'Monitor Acer', categoria: 'Monitores', image: 'images/monitor4.webp', keywords: ['monitor', 'monitores'], rating: 4.1, numRatings: 17 },
    { nome: 'Monitor AOC', categoria: 'Monitores', image: 'images/monitor5.webp', keywords: ['monitor', 'monitores'], rating: 4.4, numRatings: 29 },
    { nome: 'Monitor Ultrawide', categoria: 'Monitores', image: 'images/monitor6.webp', keywords: ['monitor', 'monitores'], rating: 3.8, numRatings: 11 },

    { nome: 'Braço Mic', categoria: 'Acessórios', image: 'images/acessorios4.webp', keywords: ['acessorio', 'acessorios'], rating: 4.0, numRatings: 19 },
    { nome: 'Mousepad RGB', categoria: 'Acessórios', image: 'images/acessorios5.webp', keywords: ['acessorio', 'acessorios'], rating: 4.3, numRatings: 27 },
    { nome: 'Base Cooler', categoria: 'Acessórios', image: 'images/acessorios6.webp', keywords: ['acessorio', 'acessorios'], rating: 3.8, numRatings: 50 },
];


/**
 * Função Matemática para Ranking (Weighted Rating).
 * Justificativa: Para um sistema de estrelas, não basta ordenar pela média.
 * Ela "puxa" a nota de produtos com poucos votos para a média global (C).
 *
 * @param {object} product - O objeto do produto (contém rating, numRatings).
 * @param {number} minNumRatings (m) - O mínimo de votos para "confiar" na nota.
 * @param {number} avgRatingAll (C) - A média de nota de todos os produtos.
 * @returns {number} A pontuação de popularidade calculada.
 */
function calculateWeightedRating(product, minNumRatings, avgRatingAll) {
    const v = product.numRatings;
    const m = minNumRatings;
    const R = product.rating;
    const C = avgRatingAll;

    // Fórmula: (v / (v+m)) * R + (m / (v+m)) * C
    return (v / (v + m)) * R + (m / (v + m)) * C;
}


// LÓGICA DO CHATBOT (Só executa na página principal)
// -------------------------------------------------

function handleChatbotLogic() {
    const chatInput = document.querySelector('.chatbot-input-area input');
    const sendButton = document.querySelector('.chatbot-input-area button');
    const messagesContainer = document.querySelector('.chatbot-mensagens');
    const chatbot = document.querySelector('.chatbot');
    const toggleChatBtn = document.getElementById('toggleChat');

    if (!chatInput || !sendButton) return;

    let chatState = 'INITIAL'; 
    let listedProducts = []; 
    let productInConfirmation = null;

    // --- Funções auxiliares do Chatbot ---

    function addMessage(content, className, isHTML = false) {
        const wrapper = document.createElement('div');
        wrapper.className = className;
        if (isHTML) {
            wrapper.innerHTML = content;
        } else {
            wrapper.innerHTML = `<p>${content.replace(/\n/g, '<br>')}</p>`;
        }
        messagesContainer.appendChild(wrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addProductCard(produto) {
        const productCardHTML = `<div class="chatbot-product-card"><img src="${produto.image}" alt="${produto.nome}"><p>Você escolheu: <strong>${produto.nome}</strong></p><p>Nota: ${produto.rating.toFixed(1)} (${produto.numRatings} avaliações)</p><p>Deseja adicionar ao carrinho?</p><div class="chatbot-confirmation-buttons"><button class="btn-confirm-yes" onclick="sendConfirmation('sim')">Sim</button><button class="btn-confirm-no" onclick="sendConfirmation('não')">Não</button></div></div>`;
        addMessage(productCardHTML, 'bot-message', true);
    }
    
    window.sendConfirmation = (response) => sendMessage(response);

    function toggleChatState() {
        chatbot.classList.toggle('minimized');
        toggleChatBtn.textContent = chatbot.classList.contains('minimized') ? '+' : '–';
    }

    function initializeChatbot() {
        // ===== MUDANÇA AQUI (DE 992 para 768) =====
        if (window.innerWidth <= 768 && !chatbot.classList.contains('minimized')) {
            toggleChatState();
        }
    }

    /** Processa a mensagem do usuário e determina a resposta do bot. */
    function handleBotResponse(userMessage) {
        const userMessageLower = userMessage.toLowerCase();

        // Refatorado para SWITCH CASE (Exigência da Faculdade)
        switch (chatState) {
            
            case 'INITIAL':
                const productsInCategory = listaDeProdutos.filter(p => p.keywords.some(k => userMessageLower.includes(k)));
                
                if (productsInCategory.length > 0) {
                    let productListMessage = `Encontrei estes itens em "${productsInCategory[0].categoria}". Qual deles te interessa?\n(Ordenado pelos mais bem avaliados)\n\n`;
                    
                    // Lógica de Ordenação (Sistema de Avaliação)
                    const m = 50; // Mínimo de 50 votos para "confiar" na nota
                    // Calcula a média de todas as notas do site (C)
                    const totalRating = listaDeProdutos.reduce((acc, p) => acc + p.rating, 0);
                    const C = totalRating / listaDeProdutos.length;
                    
                    // Ordena usando a função de Weighted Rating
                    productsInCategory.sort((a, b) => 
                        calculateWeightedRating(b, m, C) - calculateWeightedRating(a, m, C)
                    );
                    
                    listedProducts = productsInCategory;
                    
                    // Refatorado para FOR loop (Exigência da Faculdade)
                    for (let i = 0; i < listedProducts.length; i++) {
                        const p = listedProducts[i];
                        productListMessage += `${i + 1}. ${p.nome} (Nota: ${p.rating.toFixed(1)} / 5.0)\n`;
                    }
                    productListMessage += `\nDigite o número do item.`;
                    
                    addMessage(productListMessage, 'bot-message');
                    chatState = 'AWAITING_PRODUCT_CHOICE';
                
                } else {
                    addMessage("Não encontrei essa categoria. Tente 'mouses', 'teclados', etc.", 'bot-message');
                }
                break;

            case 'AWAITING_PRODUCT_CHOICE':
                const productIndex = parseInt(userMessageLower, 10) - 1;
                
                // Uso de Operadores Relacionais e Lógicos (&&)
                if (!isNaN(productIndex) && productIndex >= 0 && productIndex < listedProducts.length) {
                    productInConfirmation = listedProducts[productIndex];
                    addProductCard(productInConfirmation);
                    chatState = 'AWAITING_PURCHASE_CONFIRMATION';
                } else {
                    addMessage("Número inválido. Por favor, digite um dos números da lista.", 'bot-message');
                }
                break;

            case 'AWAITING_PURCHASE_CONFIRMATION':
                // Uso de Operadores Relacionais e Lógicos (||)
                if (userMessageLower === 'sim' || userMessageLower === 's') {
                    const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));
                    modalCompra.show();
                    addMessage(`GG! Seu ${productInConfirmation.nome} foi adicionado ao carrinho.`, 'bot-message');
                
                } else if (userMessageLower === 'não' || userMessageLower === 'nao' || userMessageLower === 'n') {
                    addMessage('Ok. Se precisar de mais alguma coisa, é só chamar!', 'bot-message');
                
                } else {
                    addMessage("Não entendi. Por favor, responda com 'Sim' ou 'Não'.", 'bot-message');
                    return; // Permanece no mesmo estado
                }
                
                // Reseta o estado
                chatState = 'INITIAL';
                listedProducts = [];
                productInConfirmation = null;
                break;
        }
    }
    
    /** Envia a mensagem do usuário (ou uma resposta pré-definida) e chama o processamento do bot. */
    function sendMessage(text = null) {
        const messageText = text !== null ? text : chatInput.value.trim();
        // Operador relacional
        if (messageText === '') return;
        
        addMessage(messageText, 'user-message');
        if (text === null) {
            chatInput.value = '';
        }
        setTimeout(() => handleBotResponse(messageText), 600);
    }
    
    // Configuração dos Event Listeners do Chatbot
    sendButton.addEventListener('click', () => sendMessage());
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') sendMessage();
    });
    toggleChatBtn.addEventListener('click', toggleChatState);
    window.addEventListener('load', initializeChatbot);
    window.addEventListener('resize', initializeChatbot);
}


// LÓGICA GERAL E PARA PÁGINAS ESPECÍFICAS
// -------------------------------------------------


/**
 * ATUALIZADO:
 * Lógica dos botões de seleção e do painel de detalhes.
 * Adiciona animações, botão de fechar e scroll automático no mobile.
 */
function handleProductSelection() {
    const selecionarButtons = document.querySelectorAll('.comprar-btn');
    const sidebar = document.getElementById('detalhe-produto-sidebar');
    const chatbot = document.querySelector('.chatbot');
    const closeBtn = document.getElementById('fechar-detalhe-btn'); // Botão de fechar

    // Elementos do painel lateral
    const detalheImg = document.getElementById('detalhe-img');
    const detalheNome = document.getElementById('detalhe-nome');
    const detalheAvaliacao = document.getElementById('detalhe-avaliacao');
    const detalhePorque = document.getElementById('detalhe-porque');
    const detalheDescricao = document.getElementById('detalhe-descricao');

    if (selecionarButtons.length === 0 || !sidebar || !chatbot || !closeBtn) return;

    // Função para fechar o painel e mostrar o chatbot
    function closeDetailsPanel() {
        sidebar.classList.remove('show');
        
        if (chatbot) {
            chatbot.style.opacity = '1';
            chatbot.style.transform = 'scale(1)';
            chatbot.style.pointerEvents = 'auto';
        }

        // Esconde o painel após a animação de saída
        setTimeout(() => {
            sidebar.classList.add('d-none');
            sidebar.classList.remove('d-block'); // ATUALIZADO de d-lg-block para d-block
        }, 400); // Deve corresponder ao tempo da transição no CSS
    }

    // Event listener para o botão de fechar
    closeBtn.addEventListener('click', closeDetailsPanel);

    // Event listeners para os botões "Selecionar"
    for (let i = 0; i < selecionarButtons.length; i++) {
        const button = selecionarButtons[i];
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productName = button.getAttribute('data-product-name');
            const product = listaDeProdutos.find(p => p.nome === productName);
            
            if (product) {
                // Preenche o painel lateral
                detalheImg.src = product.image;
                detalheNome.textContent = product.nome;
                detalheAvaliacao.textContent = `Avaliação: ${product.rating.toFixed(1)}/5 (${product.numRatings} avaliações)`;
                detalhePorque.textContent = `Este é um item muito popular entre os jogadores que buscam performance e estilo.`;
                detalheDescricao.textContent = `Descrição técnica detalhada para ${product.nome} estaria disponível aqui, incluindo especificações.`;

                // ATUALIZADO: Animação de entrada
                // 1. Esconde o chatbot
                if (chatbot) {
                    chatbot.style.opacity = '0';
                    chatbot.style.transform = 'scale(0.9)';
                    chatbot.style.pointerEvents = 'none';
                }
                
                // 2. Mostra o painel (em todas as telas)
                sidebar.classList.remove('d-none');
                sidebar.classList.add('d-block'); // ATUALIZADO de d-lg-block para d-block
                
                // 3. Ativa a classe 'show' para iniciar a transição de entrada
                setTimeout(() => { 
                    sidebar.classList.add('show');
                }, 10); // Pequeno delay para garantir que a transição CSS ocorra

                // 4. NOVO: Scroll automático para o painel em telas móveis
                // ===== MUDANÇA AQUI (DE 992 para 768) =====
                if (window.innerWidth < 768) { // 768px é o breakpoint 'md' do Bootstrap
                    setTimeout(() => { // Espera a animação de fade-in estar visível
                        sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50); // Delay curto para o DOM atualizar
                }
            } else {
                console.error("Produto não encontrado no script.js:", productName);
            }
        });
    }
}

/**
 * Inicializa a lógica do Acordeão (Accordion) na página de informações (info.html).
 */
function handleAccordion() {
    const accordionElement = document.getElementById('infoAccordion');

    if (accordionElement) {
        let lastOpened = null;

        accordionElement.addEventListener('shown.bs.collapse', (event) => {
            const currentCard = event.target.closest('.card');

            if (lastOpened && lastOpened !== event.target) {
                const lastCollapse = bootstrap.Collapse.getInstance(lastOpened);
                if (lastCollapse) {
                    lastCollapse.hide();
                }
            }
            lastOpened = event.target;

            if (currentCard) {
                currentCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        const initiallyOpen = accordionElement.querySelector('.collapse.show');
        if (initiallyOpen) {
            lastOpened = initiallyOpen;
        }
    }
}


/**
 * Lógica para validação e submissão do formulário de contato (form.html).
 */
function handleContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    function setError(input, errorId, message) {
        input.classList.add('is-invalid');
        document.getElementById(errorId).textContent = message;
    }

    function clearError(input, errorId) {
        input.classList.remove('is-invalid');
        document.getElementById(errorId).textContent = '';
    }

    /** Realiza a validação de todos os campos do formulário (IF/ELSE IF/ELSE). */
    function validateForm() {
        let isValid = true;
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const mensagemInput = document.getElementById('mensagem');

        // Validação Nome (Uso de IF/ELSE)
        if (nomeInput.value.trim() === '') {
            setError(nomeInput, 'nomeError', 'O campo nome é obrigatório.');
            isValid = false;
        } else {
            clearError(nomeInput, 'nomeError');
        }

        // Validação E-mail (Uso de IF/ELSE IF/ELSE)
        if (emailInput.value.trim() === '') {
            setError(emailInput, 'emailError', 'O campo e-mail é obrigatório.');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
            setError(emailInput, 'emailError', 'Por favor, insira um e-mail válido.');
            isValid = false;
        } else {
            clearError(emailInput, 'emailError');
        }

        // Validação Mensagem
        if (mensagemInput.value.trim() === '') {
            setError(mensagemInput, 'mensagemError', 'Por favor, escreva uma mensagem.');
            isValid = false;
        } else {
            clearError(mensagemInput, 'mensagemError');
        }
        return isValid;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            const myModal = new bootstrap.Modal(document.getElementById('confirmEnviarModal'));
            myModal.show();
            document.getElementById('confirmEnviar').addEventListener('click', () => {
                window.location.href = '../index.html';
            });
        }
    });
}

/**
 * Adiciona o listener de clique ao botão "Comprar agora" no painel de detalhes (index.html).
 */
function handleCheckoutButton() {
    const botaoComprar = document.querySelector('.btn-comprar-agora');
    
    // Verifica se o botão existe na página atual (só existe no index.html)
    if (botaoComprar) {
        botaoComprar.addEventListener('click', () => {
            window.location.href = 'pages/checkout.html';
        });
    }
}


/**
 * Função principal que inicializa todas as lógicas da aplicação.
 */
function init() {
    handleChatbotLogic();
    handleProductSelection();
    handleAccordion();
    handleContactForm();
    handleCheckoutButton(); // Lógica movida do index.html
}

document.addEventListener('DOMContentLoaded', init);