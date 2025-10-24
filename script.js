// BANCO DE DADOS SIMPLIFICADO DE PRODUTOS
// A base de dados foi enriquecida com campos 'views' e 'sales' para fins de cálculo de pontuação.
// -------------------------------------------------

const listaDeProdutos = [
    // Teclados
    { nome: 'Teclado Mecânico', categoria: 'Teclados', image: 'images/teclado.webp', keywords: ['teclado', 'teclados'], views: 1500, sales: 35 },
    { nome: 'Teclado Gamer RGB', categoria: 'Teclados', image: 'images/Teclado.2.png', keywords: ['teclado', 'teclados'], views: 3200, sales: 80 },
    { nome: 'Teclado Compacto', categoria: 'Teclados', image: 'images/Teclado.3.png', keywords: ['teclado', 'teclados'], views: 800, sales: 15 },
    // Cadeiras
    { nome: 'Cadeira Gamer Rosa', categoria: 'Cadeiras', image: 'images/cadeira.jpg', keywords: ['cadeira', 'cadeiras'], views: 4500, sales: 120 },
    { nome: 'Cadeira Fortrek', categoria: 'Cadeiras', image: 'images/Cadeira.2.png', keywords: ['cadeira', 'cadeiras'], views: 2100, sales: 60 },
    { nome: 'Cadeira Preta', categoria: 'Cadeiras', image: 'images/Cadeira.3.png', keywords: ['cadeira', 'cadeiras'], views: 900, sales: 25 },
    // Mesas
    { nome: 'Mesa Gamer com Prateleiras', categoria: 'Mesas', image: 'images/mesagamer.jpg', keywords: ['mesa', 'mesas'], views: 1800, sales: 40 },
    { nome: 'Mesa em L', categoria: 'Mesas', image: 'images/Mesa.2.png', keywords: ['mesa', 'mesas'], views: 700, sales: 12 },
    { nome: 'Mesa de Madeira', categoria: 'Mesas', image: 'images/Mesa.3.png', keywords: ['mesa', 'mesas'], views: 1100, sales: 28 },
    // Mouses
    { nome: 'Mouse Ultra Light', categoria: 'Mouses', image: 'images/mouse.jpg', keywords: ['mouse', 'mouses'], views: 6000, sales: 150 },
    { nome: 'Mouse Razer Edição', categoria: 'Mouses', image: 'images/mouserazer.webp', keywords: ['mouse', 'mouses'], views: 4200, sales: 100 },
    { nome: 'Mouse Gamer Logitech', categoria: 'Mouses', image: 'images/Mouse.3 (2).png', keywords: ['mouse', 'mouses'], views: 5100, sales: 115 },
    // Fones
    { nome: 'Fone RGB 7.1', categoria: 'Fones (Headsets)', image: 'images/fone1.webp', keywords: ['fone', 'fones', 'headset', 'headsets'], views: 3800, sales: 90 },
    { nome: 'Headset Havit', categoria: 'Fones (Headsets)', image: 'images/Fone.2.png', keywords: ['fone', 'fones', 'headset', 'headsets'], views: 1900, sales: 55 },
    { nome: 'Headset JBL Quantum', categoria: 'Fones (Headsets)', image: 'images/Fone.3.png', keywords: ['fone', 'fones', 'headset', 'headsets'], views: 2700, sales: 75 },
    // Monitores
    { nome: 'Monitor 27" 144hz', categoria: 'Monitores', image: 'images/Monitor.png', keywords: ['monitor', 'monitores'], views: 500, sales: 10 },
    { nome: 'Monitor LG UltraGear 24"', categoria: 'Monitores', image: 'images/Monitor.2.png', keywords: ['monitor', 'monitores'], views: 1600, sales: 30 },
    { nome: 'Monitor Alltek 21"', categoria: 'Monitores', image: 'images/Monitor.3.png', keywords: ['monitor', 'monitores'], views: 1300, sales: 22 },
    // Acessórios
    { nome: 'Kit Mousepad Extenso', categoria: 'Acessórios', image: 'images/conjunto.webp', keywords: ['acessorio', 'acessorios', 'mousepad'], views: 2400, sales: 70 },
    { nome: 'Suporte Monitor USB', categoria: 'Acessórios', image: 'images/suporte.jpg', keywords: ['acessorio', 'acessorios', 'suporte'], views: 1700, sales: 45 },
    { nome: 'Mousepad Ergonômico', categoria: 'Acessórios', image: 'images/mousepad.jpg', keywords: ['acessorio', 'acessorios', 'mousepad'], views: 950, sales: 20 },
];



// LÓGICA DO CHATBOT (Só executa na página principal)
// -------------------------------------------------

function handleChatbotLogic() {
    const chatInput = document.querySelector('.chatbot-input-area input');
    const sendButton = document.querySelector('.chatbot-input-area button');
    const messagesContainer = document.querySelector('.chatbot-mensagens');
    const chatbot = document.querySelector('.chatbot');
    const toggleChatBtn = document.getElementById('toggleChat');

    // Se os elementos não existirem (ex: página de contato), sai da função.
    if (!chatInput || !sendButton) return;

    let chatState = 'INITIAL'; 
    let listedProducts = []; 
    let productInConfirmation = null;

    // Funções auxiliares do Chatbot

    /** Adiciona uma mensagem ao contêiner de mensagens. */
    function addMessage(content, className, isHTML = false) {
        const wrapper = document.createElement('div');
        wrapper.className = className;
        if (isHTML) {
            wrapper.innerHTML = content;
        } else {
            // Permite quebrar linha com \n
            wrapper.innerHTML = `<p>${content.replace(/\n/g, '<br>')}</p>`;
        }
        messagesContainer.appendChild(wrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /** Gera e exibe o card de produto com botões de confirmação de compra. */
    function addProductCard(produto) {
        const productCardHTML = `<div class="chatbot-product-card"><img src="${produto.image}" alt="${produto.nome}"><p>Você escolheu: <strong>${produto.nome}</strong></p><p>Deseja adicionar ao carrinho?</p><div class="chatbot-confirmation-buttons"><button class="btn-confirm-yes" onclick="sendConfirmation('sim')">Sim</button><button class="btn-confirm-no" onclick="sendConfirmation('não')">Não</button></div></div>`;
        addMessage(productCardHTML, 'bot-message', true);
    }
    
    // Torna a função de confirmação acessível globalmente (para o 'onclick' no HTML gerado)
    window.sendConfirmation = (response) => sendMessage(response);

    /** Alterna o estado de minimizado do chatbot. */
    function toggleChatState() {
        chatbot.classList.toggle('minimized');
        toggleChatBtn.textContent = chatbot.classList.contains('minimized') ? '+' : '–';
    }

    /** Inicializa o estado do chatbot (minimizado em telas pequenas). */
    function initializeChatbot() {
        if (window.innerWidth <= 768 && !chatbot.classList.contains('minimized')) {
            toggleChatState();
        }
    }

    /** Processa a mensagem do usuário e determina a resposta do bot. */
    function handleBotResponse(userMessage) {
        const userMessageLower = userMessage.toLowerCase();

        if (chatState === 'AWAITING_PRODUCT_CHOICE') {
            const productIndex = parseInt(userMessageLower, 10) - 1;
            if (!isNaN(productIndex) && productIndex >= 0 && productIndex < listedProducts.length) {
                productInConfirmation = listedProducts[productIndex];
                addProductCard(productInConfirmation);
                chatState = 'AWAITING_PURCHASE_CONFIRMATION';
            } else {
                addMessage("Número inválido. Por favor, digite um dos números da lista.", 'bot-message');
            }
            return;
        }

        if (chatState === 'AWAITING_PURCHASE_CONFIRMATION') {
            if (userMessageLower === 'sim' || userMessageLower === 's') {
                const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));
                modalCompra.show();
                addMessage(`GG! Seu ${productInConfirmation.nome} foi adicionado ao carrinho.`, 'bot-message');
            } else if (userMessageLower === 'não' || userMessageLower === 'nao' || userMessageLower === 'n') {
                addMessage('Ok. Se precisar de mais alguma coisa, é só chamar!', 'bot-message');
            } else {
                addMessage("Não entendi. Por favor, responda com 'Sim' ou 'Não'.", 'bot-message');
                return;
            }
            chatState = 'INITIAL';
            listedProducts = [];
            productInConfirmation = null;
            return;
        }

        if (chatState === 'INITIAL') {
            const productsInCategory = listaDeProdutos.filter(p => p.keywords.some(k => userMessageLower.includes(k)));
            if (productsInCategory.length > 0) {
                let productListMessage = `Encontrei estes itens em "${productsInCategory[0].categoria}". Qual deles te interessa?\n\n`;
                
                // Aplica a função de 1º grau para ordenar os produtos (ranqueamento)
                productsInCategory.sort((a, b) => calculateRatingScore(b.views, b.sales) - calculateRatingScore(a.views, a.sales));
                
                productsInCategory.forEach((p, i) => { 
                    productListMessage += `${i + 1}. ${p.nome}\n`; 
                });
                productListMessage += `\nDigite o número do item.`;
                
                addMessage(productListMessage, 'bot-message');
                listedProducts = productsInCategory;
                chatState = 'AWAITING_PRODUCT_CHOICE';
            } else {
                addMessage("Não encontrei essa categoria. Tente 'mouses', 'teclados', etc.", 'bot-message');
            }
        }
    }
    
    /** Envia a mensagem do usuário (ou uma resposta pré-definida) e chama o processamento do bot. */
    function sendMessage(text = null) {
        const messageText = text !== null ? text : chatInput.value.trim();
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
 * Inicializa a lógica dos botões de compra na página principal (index.html).
 */
function handlePurchaseButtons() {
    const comprarButtons = document.querySelectorAll('.comprar-btn');
    const modalElement = document.getElementById('modalCompra');
    
    if (comprarButtons.length > 0 && modalElement) {
        const modalCompra = new bootstrap.Modal(modalElement);

        comprarButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                modalCompra.show();
                // Feedback visual temporário no botão
                const originalText = button.textContent;
                button.textContent = "Adicionado!";
                button.disabled = true;
                setTimeout(() => { 
                    button.textContent = originalText; 
                    button.disabled = false; 
                }, 1500);
            });
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

            // Fechar o último painel aberto
            if (lastOpened && lastOpened !== event.target) {
                const lastCollapse = bootstrap.Collapse.getInstance(lastOpened);
                if (lastCollapse) {
                    lastCollapse.hide();
                }
            }

            lastOpened = event.target;

            // Scroll para o painel aberto
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

    // Funções auxiliares para manipulação de erro no formulário
    function setError(input, errorId, message) {
        input.classList.add('is-invalid');
        document.getElementById(errorId).textContent = message;
    }

    function clearError(input, errorId) {
        input.classList.remove('is-invalid');
        document.getElementById(errorId).textContent = '';
    }

    /** Realiza a validação de todos os campos do formulário. */
    function validateForm() {
        let isValid = true;
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const mensagemInput = document.getElementById('mensagem');

        // Validação Nome
        if (nomeInput.value.trim() === '') {
            setError(nomeInput, 'nomeError', 'O campo nome é obrigatório.');
            isValid = false;
        } else {
            clearError(nomeInput, 'nomeError');
        }

        // Validação E-mail
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

    // Event Listener principal do formulário (Submissão)
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            const myModal = new bootstrap.Modal(document.getElementById('confirmEnviarModal'));
            myModal.show();
            // Redireciona para a página inicial ao fechar o modal
            document.getElementById('confirmEnviar').addEventListener('click', () => {
                window.location.href = '../index.html';
            });
        }
    });
}


/**

 * Adaptado ao conceito de 'main' ou 'método de inicialização' de uma classe Java.
 */
function init() {
    handleChatbotLogic();
    handlePurchaseButtons();
    handleAccordion();
    handleContactForm();
}

// Inicia a aplicação após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', init);