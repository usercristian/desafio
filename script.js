// ===================================================================================
// BANCO DE DADOS SIMPLIFICADO DE PRODUTOS
// ===================================================================================
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

// ===================================================================================
// LÓGICA DO CHATBOT
// ===================================================================================
const chatInput = document.querySelector('.chatbot-input-area input');
const sendButton = document.querySelector('.chatbot-input-area button');
const messagesContainer = document.querySelector('.chatbot-mensagens');
const chatbot = document.querySelector('.chatbot');
const toggleChatBtn = document.getElementById('toggleChat');

// Verifica se os elementos do chatbot existem antes de adicionar os eventos
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
                const chosenProduct = listedProducts[productIndex];
                productInConfirmation = chosenProduct;
                addProductCard(chosenProduct);
                chatState = 'AWAITING_PURCHASE_CONFIRMATION';
            } else {
                addMessage("Número inválido. Por favor, digite um dos números da lista acima.", 'bot-message');
            }
            return;
        }

        if (chatState === 'AWAITING_PURCHASE_CONFIRMATION') {
            if (userMessageLower === 'sim' || userMessageLower === 's') {
                const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));
                modalCompra.show();
                addMessage(`Ótimo! Adicionei o ${productInConfirmation.nome} ao seu carrinho.`, 'bot-message');
            } else if (userMessageLower === 'não' || userMessageLower === 'nao' || userMessageLower === 'n') {
                addMessage('Ok, sem problemas. Digite outra categoria se quiser ver outros produtos.', 'bot-message');
            } else {
                addMessage("Desculpe, não entendi. Por favor, clique ou digite 'Sim' ou 'Não'.", 'bot-message');
                return;
            }
            
            chatState = 'INITIAL';
            listedProducts = [];
            productInConfirmation = null;
            return;
        }

        if (chatState === 'INITIAL') {
            const productsInCategory = listaDeProdutos.filter(produto => 
                produto.keywords.some(keyword => userMessageLower.includes(keyword))
            );

            if (productsInCategory.length > 0) {
                let productListMessage = `Encontrei estes itens na categoria "${productsInCategory[0].categoria}". Qual você gostaria de ver?\n\n`;
                productsInCategory.forEach((product, index) => {
                    productListMessage += `${index + 1}. ${product.nome}\n`;
                });
                productListMessage += `\nDigite o número do item que você deseja.`;

                addMessage(productListMessage, 'bot-message');
                listedProducts = productsInCategory;
                chatState = 'AWAITING_PRODUCT_CHOICE';
            } else {
                addMessage("Desculpe, não encontrei produtos para essa categoria. Tente digitar 'mouses', 'teclados' ou 'cadeiras'.", 'bot-message');
            }
        }
    }

    function addProductCard(produto) {
        const productCardHTML = `
            <div class="chatbot-product-card">
                <img src="${produto.image}" alt="${produto.nome}">
                <p>Você escolheu: <strong>${produto.nome}</strong></p>
                <p>Deseja finalizar a compra?</p>
                <div class="chatbot-confirmation-buttons">
                    <button class="btn-confirm-yes" onclick="sendConfirmation('sim')">Sim</button>
                    <button class="btn-confirm-no" onclick="sendConfirmation('não')">Não</button>
                </div>
            </div>
        `;
        addMessage(productCardHTML, 'bot-message', true);
    }

    window.sendConfirmation = function(response) {
        sendMessage(response);
    }

    function addMessage(content, className, isHTML = false) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add(className);

        if (isHTML) {
            messageWrapper.innerHTML = content;
        } else {
            const textWithBreaks = content.replace(/\n/g, '<br>');
            const textElement = document.createElement('p');
            textElement.innerHTML = textWithBreaks;
            messageWrapper.appendChild(textElement);
        }
        
        messagesContainer.appendChild(messageWrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function toggleChatState() {
        chatbot.classList.toggle('minimized');
        if (chatbot.classList.contains('minimized')) {
            toggleChatBtn.textContent = '+';
            toggleChatBtn.setAttribute('title', 'Abrir Chat');
        } else {
            toggleChatBtn.textContent = '–';
            toggleChatBtn.setAttribute('title', 'Minimizar Chat');
        }
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
    
    // --- LÓGICA PARA O MODAL DE COMPRA (só funciona na index.html) ---
    const comprarButtons = document.querySelectorAll('.comprar-btn');
    const modalElement = document.getElementById('modalCompra');
    if (comprarButtons.length > 0 && modalElement) {
        const modalCompra = new bootstrap.Modal(modalElement);
        comprarButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                modalCompra.show();
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

    // --- LÓGICA PARA O ACCORDION DA PÁGINA INFO (só funciona em info.html) ---
    const accordionElement = document.getElementById('infoAccordion');
    if (accordionElement) {
        const accordionHeaders = accordionElement.querySelectorAll('.card-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const icon = this.querySelector('.icone-expandir');
                const collapseTarget = document.querySelector(this.getAttribute('data-bs-target'));

                // Pequeno delay para esperar a classe 'show' ser removida pelo bootstrap
                setTimeout(() => {
                    if (collapseTarget.classList.contains('show')) {
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }, 250);
            });
        });
    }
});