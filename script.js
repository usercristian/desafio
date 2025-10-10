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

// --- NOVA LÓGICA: Variáveis para controlar o estado da conversa ---
let chatState = 'INITIAL'; // Estados: INITIAL, AWAITING_PRODUCT_CHOICE, AWAITING_PURCHASE_CONFIRMATION
let listedProducts = []; // Guarda os produtos que foram listados para o usuário escolher
let productInConfirmation = null; // Guarda o produto final escolhido

// Eventos de clique e tecla para enviar a mensagem
sendButton.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});

// Função principal que envia a mensagem do usuário
function sendMessage(text = null) {
    const messageText = text !== null ? text : chatInput.value.trim();
    if (messageText === '') return;

    addMessage(messageText, 'user-message');
    
    if (text === null) {
        chatInput.value = '';
    }

    setTimeout(() => handleBotResponse(messageText), 600);
}

// --- FUNÇÃO REESTRUTURADA: Lida com a resposta do bot baseada em estados ---
function handleBotResponse(userMessage) {
    const userMessageLower = userMessage.toLowerCase();

    // Estado: Aguardando o usuário escolher um produto da lista pelo número
    if (chatState === 'AWAITING_PRODUCT_CHOICE') {
        const productIndex = parseInt(userMessageLower, 10) - 1; // Converte "1" para o índice 0, "2" para 1, etc.

        // Verifica se o número é válido e corresponde a um produto na lista
        if (!isNaN(productIndex) && productIndex >= 0 && productIndex < listedProducts.length) {
            const chosenProduct = listedProducts[productIndex];
            productInConfirmation = chosenProduct; // Guarda o produto escolhido
            addProductCard(chosenProduct); // Mostra o card de confirmação com a imagem
            chatState = 'AWAITING_PURCHASE_CONFIRMATION'; // Muda o estado para aguardar 'sim' ou 'não'
        } else {
            addMessage("Número inválido. Por favor, digite um dos números da lista acima.", 'bot-message');
        }
        return;
    }

    // Estado: Aguardando o usuário confirmar a compra com 'sim' ou 'não'
    if (chatState === 'AWAITING_PURCHASE_CONFIRMATION') {
        if (userMessageLower === 'sim' || userMessageLower === 's') {
            const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));
            modalCompra.show();
            addMessage(`Ótimo! Adicionei o ${productInConfirmation.nome} ao seu carrinho.`, 'bot-message');
        } else if (userMessageLower === 'não' || userMessageLower === 'nao' || userMessageLower === 'n') {
            addMessage('Ok, sem problemas. Digite outra categoria se quiser ver outros produtos.', 'bot-message');
        } else {
            addMessage("Desculpe, não entendi. Por favor, clique ou digite 'Sim' ou 'Não'.", 'bot-message');
            return; // Continua esperando a resposta certa
        }
        
        // Reseta o estado para o início da conversa
        chatState = 'INITIAL';
        listedProducts = [];
        productInConfirmation = null;
        return;
    }

    // Estado: Inicial, procurando por uma categoria na mensagem do usuário
    if (chatState === 'INITIAL') {
        // Filtra a lista de produtos para encontrar todos que correspondem à categoria digitada
        const productsInCategory = listaDeProdutos.filter(produto => 
            produto.keywords.some(keyword => userMessageLower.includes(keyword))
        );

        if (productsInCategory.length > 0) {
            // Se encontrou produtos, monta uma lista numerada para o usuário
            let productListMessage = `Encontrei estes itens na categoria "${productsInCategory[0].categoria}". Qual você gostaria de ver?\n\n`;
            productsInCategory.forEach((product, index) => {
                productListMessage += `${index + 1}. ${product.nome}\n`;
            });
            productListMessage += `\nDigite o número do item que você deseja.`;

            addMessage(productListMessage, 'bot-message');
            listedProducts = productsInCategory; // Guarda a lista de produtos encontrados
            chatState = 'AWAITING_PRODUCT_CHOICE'; // Muda o estado para aguardar a escolha do número
        } else {
            // Se não encontrou nenhuma categoria
            addMessage("Desculpe, não encontrei produtos para essa categoria. Tente digitar 'mouses', 'teclados' ou 'cadeiras'.", 'bot-message');
        }
    }
}

// Mostra o card do produto com imagem e botões de Sim/Não
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

// Função chamada pelos botões de confirmação
function sendConfirmation(response) {
    sendMessage(response);
}

// Adiciona uma mensagem (em texto ou HTML) na tela
function addMessage(content, className, isHTML = false) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add(className);

    if (isHTML) {
        messageWrapper.innerHTML = content;
    } else {
        // Para textos com quebra de linha (\n), precisamos tratar
        const textWithBreaks = content.replace(/\n/g, '<br>');
        const textElement = document.createElement('p');
        textElement.innerHTML = textWithBreaks;
        messageWrapper.appendChild(textElement);
    }
    
    messagesContainer.appendChild(messageWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


// ===================================================================================
// CÓDIGO PARA O MODAL DE COMPRA E MINIMIZAÇÃO DO CHAT (sem alterações)
// ===================================================================================
const comprarButtons = document.querySelectorAll('.comprar-btn');
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('modalCompra');
    if (modalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
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
    } else {
        comprarButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert("Compra confirmada!");
            });
        });
    }
});

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