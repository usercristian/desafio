
// BANCO DE DADOS SIMPLIFICADO DE PRODUTOS
// -------------------------------------------------

const listaDeProdutos = [
    // Teclados
    { nome: 'Teclado Mecânico', categoria: 'Teclados', image: 'images/teclado.webp', keywords: ['teclado', 'teclados'] },
    { nome: 'Teclado Gamer RGB', categoria: 'Teclados', image: 'images/Teclado.2.png', keywords: ['teclado', 'teclados'] },
    { nome: 'Teclado Compacto', categoria: 'Teclados', image: 'images/Teclado.3.png', keywords: ['teclado', 'teclados'] },
    // Cadeiras
    { nome: 'Cadeira Gamer Rosa', categoria: 'Cadeiras', image: 'images/cadeira.jpg', keywords: ['cadeira', 'cadeiras'] },
    { nome: 'Cadeira Fortrek', categoria: 'Cadeiras', image: 'images/Cadeira.2.png', keywords: ['cadeira', 'cadeiras'] },
    { nome: 'Cadeira Preta', categoria: 'Cadeiras', image: 'images/Cadeira.3.png', keywords: ['cadeira', 'cadeiras'] },
    // Mesas
    { nome: 'Mesa Gamer com Prateleiras', categoria: 'Mesas', image: 'images/mesagamer.jpg', keywords: ['mesa', 'mesas'] },
    { nome: 'Mesa em L', categoria: 'Mesas', image: 'images/Mesa.2.png', keywords: ['mesa', 'mesas'] },
    { nome: 'Mesa de Madeira', categoria: 'Mesas', image: 'images/Mesa.3.png', keywords: ['mesa', 'mesas'] },
    // Mouses
    { nome: 'Mouse Ultra Light', categoria: 'Mouses', image: 'images/mouse.jpg', keywords: ['mouse', 'mouses'] },
    { nome: 'Mouse Razer Edição', categoria: 'Mouses', image: 'images/mouserazer.webp', keywords: ['mouse', 'mouses'] },
    { nome: 'Mouse Gamer Logitech', categoria: 'Mouses', image: 'images/Mouse.3 (2).png', keywords: ['mouse', 'mouses'] },
    // Fones
    { nome: 'Fone RGB 7.1', categoria: 'Fones (Headsets)', image: 'images/fone1.webp', keywords: ['fone', 'fones', 'headset', 'headsets'] },
    { nome: 'Headset Havit', categoria: 'Fones (Headsets)', image: 'images/Fone.2.png', keywords: ['fone', 'fones', 'headset', 'headsets'] },
    { nome: 'Headset JBL Quantum', categoria: 'Fones (Headsets)', image: 'images/Fone.3.png', keywords: ['fone', 'fones', 'headset', 'headsets'] },
    // Monitores
    { nome: 'Monitor 27" 144hz', categoria: 'Monitores', image: 'images/Monitor.png', keywords: ['monitor', 'monitores'] },
    { nome: 'Monitor LG UltraGear 24"', categoria: 'Monitores', image: 'images/Monitor.2.png', keywords: ['monitor', 'monitores'] },
    { nome: 'Monitor Alltek 21"', categoria: 'Monitores', image: 'images/Monitor.3.png', keywords: ['monitor', 'monitores'] },
    // Acessórios
    { nome: 'Kit Mousepad Extenso', categoria: 'Acessórios', image: 'images/conjunto.webp', keywords: ['acessorio', 'acessorios', 'mousepad'] },
    { nome: 'Suporte Monitor USB', categoria: 'Acessórios', image: 'images/suporte.jpg', keywords: ['acessorio', 'acessorios', 'suporte'] },
    { nome: 'Mousepad Ergonômico', categoria: 'Acessórios', image: 'images/mousepad.jpg', keywords: ['acessorio', 'acessorios', 'mousepad'] },
];


// LÓGICA DO CHATBOT (SÓ EXECUTA NA PÁGINA PRINCIPAL)
// -------------------------------------------------

const chatInput = document.querySelector('.chatbot-input-area input');
const sendButton = document.querySelector('.chatbot-input-area button');
const messagesContainer = document.querySelector('.chatbot-mensagens');
const chatbot = document.querySelector('.chatbot');
const toggleChatBtn = document.getElementById('toggleChat');

if (chatInput && sendButton) {
    let chatState = 'INITIAL'; 
    let listedProducts = []; 
    let productInConfirmation = null;

    sendButton.addEventListener('click', () => sendMessage());
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') sendMessage();
    });

    function sendMessage(text = null) {
        const messageText = text !== null ? text : chatInput.value.trim();
        if (messageText === '') return;
        addMessage(messageText, 'user-message');
        if (text === null) {
            chatInput.value = '';
        }
        setTimeout(() => handleBotResponse(messageText), 600);
    }

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
                productsInCategory.forEach((p, i) => { productListMessage += `${i + 1}. ${p.nome}\n`; });
                productListMessage += `\nDigite o número do item.`;
                addMessage(productListMessage, 'bot-message');
                listedProducts = productsInCategory;
                chatState = 'AWAITING_PRODUCT_CHOICE';
            } else {
                addMessage("Não encontrei essa categoria. Tente 'mouses', 'teclados', etc.", 'bot-message');
            }
        }
    }

    function addProductCard(produto) {
        const productCardHTML = `<div class="chatbot-product-card"><img src="${produto.image}" alt="${produto.nome}"><p>Você escolheu: <strong>${produto.nome}</strong></p><p>Deseja adicionar ao carrinho?</p><div class="chatbot-confirmation-buttons"><button class="btn-confirm-yes" onclick="sendConfirmation('sim')">Sim</button><button class="btn-confirm-no" onclick="sendConfirmation('não')">Não</button></div></div>`;
        addMessage(productCardHTML, 'bot-message', true);
    }

    window.sendConfirmation = (response) => sendMessage(response);

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

    function toggleChatState() {
        chatbot.classList.toggle('minimized');
        toggleChatBtn.textContent = chatbot.classList.contains('minimized') ? '+' : '–';
    }
    toggleChatBtn.addEventListener('click', toggleChatState);

    function initializeChatbot() {
        if (window.innerWidth <= 768 && !chatbot.classList.contains('minimized')) {
            toggleChatState();
        }
    }
    window.addEventListener('load', initializeChatbot);
    window.addEventListener('resize', initializeChatbot);
}




// ===================================================================================
// CÓDIGO GERAL E PARA PÁGINAS ESPECÍFICAS
// ===================================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA PARA O MODAL DE COMPRA (só roda na index.html) ---
    const comprarButtons = document.querySelectorAll('.comprar-btn');
    const modalElement = document.getElementById('modalCompra');
    if (comprarButtons.length > 0 && modalElement) {
        const modalCompra = new bootstrap.Modal(modalElement);
        comprarButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                modalCompra.show();
                const originalText = button.textContent;
                button.textContent = "Adicionado!";
                button.disabled = true;
                setTimeout(() => { button.textContent = originalText; button.disabled = false; }, 1500);
            });
        });
    }

    // --- LÓGICA PARA O ACCORDION DA PÁGINA INFO (só roda em info.html) ---
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
    
    // --- LÓGICA PARA VALIDAÇÃO DO FORMULÁRIO (só roda em form.html) ---
    const form = document.getElementById('contactForm');
    if (form) {
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

        function validateForm() {
            let isValid = true;
            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const mensagemInput = document.getElementById('mensagem');

            if (nomeInput.value.trim() === '') {
                setError(nomeInput, 'nomeError', 'O campo nome é obrigatório.');
                isValid = false;
            } else {
                clearError(nomeInput, 'nomeError');
            }

            if (emailInput.value.trim() === '') {
                setError(emailInput, 'emailError', 'O campo e-mail é obrigatório.');
                isValid = false;
            } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
                setError(emailInput, 'emailError', 'Por favor, insira um e-mail válido.');
                isValid = false;
            } else {
                clearError(emailInput, 'emailError');
            }

            if (mensagemInput.value.trim() === '') {
                setError(mensagemInput, 'mensagemError', 'Por favor, escreva uma mensagem.');
                isValid = false;
            } else {
                clearError(mensagemInput, 'mensagemError');
            }
            return isValid;
        }

        function setError(input, errorId, message) {
            input.classList.add('is-invalid');
            document.getElementById(errorId).textContent = message;
        }

        function clearError(input, errorId) {
            input.classList.remove('is-invalid');
            document.getElementById(errorId).textContent = '';
        }
    }
});