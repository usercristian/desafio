// ===================================================================================
// BANCO DE DADOS SIMPLIFICADO DE PRODUTOS
// ===================================================================================
const listaDeProdutos = [
    // Teclados
    { nome: 'Teclado Mecânico', categoria: 'Teclados', image: 'images/teclado.webp', keywords: ['mecânico', 'teclado mecânico'] },
    { nome: 'Teclado Gamer RGB', categoria: 'Teclados', image: 'images/Teclado.2.png', keywords: ['rgb', 'luz', 'colorido'] },
    { nome: 'Teclado Compacto', categoria: 'Teclados', image: 'images/Teclado.3.png', keywords: ['compacto', 'pequeno', 'mini'] },
    // Cadeiras
    { nome: 'Cadeira Gamer Rosa', categoria: 'Cadeiras', image: 'images/cadeira.jpg', keywords: ['rosa', 'cadeira rosa'] },
    { nome: 'Cadeira Fortrek', categoria: 'Cadeiras', image: 'images/Cadeira.2.png', keywords: ['fortrek'] },
    { nome: 'Cadeira Preta', categoria: 'Cadeiras', image: 'images/Cadeira.3.png', keywords: ['preta', 'cadeira preta'] },
    // Mesas
    { nome: 'Mesa Gamer com Prateleiras', categoria: 'Mesas', image: 'images/mesagamer.jpg', keywords: ['prateleira', 'com prateleira'] },
    { nome: 'Mesa em L', categoria: 'Mesas', image: 'images/Mesa.2.png', keywords: ['mesa l', 'canto'] },
    { nome: 'Mesa de Madeira', categoria: 'Mesas', image: 'images/Mesa.3.png', keywords: ['madeira'] },
    // Mouses
    { nome: 'Mouse Ultra Light', categoria: 'Mouses', image: 'images/mouse.jpg', keywords: ['ultra light', 'leve'] },
    { nome: 'Mouse Razer Edição', categoria: 'Mouses', image: 'images/mouserazer.webp', keywords: ['razer'] },
    { nome: 'Mouse Gamer Logitech', categoria: 'Mouses', image: 'images/Mouse.3 (2).png', keywords: ['logitech'] },
    // Fones
    { nome: 'Fone RGB 7.1', categoria: 'Fones (Headsets)', image: 'images/fone1.webp', keywords: ['fone rgb', 'headset 7.1'] },
    { nome: 'Headset Havit', categoria: 'Fones (Headsets)', image: 'images/Fone.2.png', keywords: ['havit'] },
    { nome: 'Headset JBL Quantum', categoria: 'Fones (Headsets)', image: 'images/Fone.3.png', keywords: ['jbl', 'quantum'] },
    // Monitores
    { nome: 'Monitor 27" 144hz', categoria: 'Monitores', image: 'images/Monitor.png', keywords: ['27 polegadas', '144hz', 'monitor grande'] },
    { nome: 'Monitor LG UltraGear 24"', categoria: 'Monitores', image: 'images/Monitor.2.png', keywords: ['lg', 'ultragear', '24 polegadas'] },
    { nome: 'Monitor Alltek 21"', categoria: 'Monitores', image: 'images/Monitor.3.png', keywords: ['alltek', '21 polegadas'] },
    // Acessórios
    { nome: 'Kit Mousepad Extenso', categoria: 'Acessórios', image: 'images/conjunto.webp', keywords: ['mousepad grande', 'extenso', 'kit mousepad'] },
    { nome: 'Suporte Monitor USB', categoria: 'Acessórios', image: 'images/suporte.jpg', keywords: ['suporte monitor', 'suporte com usb'] },
    { nome: 'Mousepad Ergonômico', categoria: 'Acessórios', image: 'images/mousepad.jpg', keywords: ['ergonômico', 'mousepad com apoio'] },
];

// ===================================================================================
// LÓGICA DO CHATBOT
// ===================================================================================

const chatInput = document.querySelector('.chatbot-input-area input');
const sendButton = document.querySelector('.chatbot-input-area button');
const messagesContainer = document.querySelector('.chatbot-mensagens');
const chatbot = document.querySelector('.chatbot');
const toggleChatBtn = document.getElementById('toggleChat');

const CATEGORIAS_PRODUTOS = [ "Teclados", "Cadeiras", "Mesas", "Mouses", "Fones (Headsets)", "Monitores", "Acessórios" ];

let awaitingConfirmation = false;
let productInConfirmation = null;

sendButton.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});

// --- FUNÇÃO CORRIGIDA ---
// Agora a função aceita um parâmetro 'text'.
// Se 'text' for fornecido (vindo de um clique de botão), ele será usado.
// Se não, ela pega o valor do campo de input, como fazia antes.
function sendMessage(text = null) {
    // Usa o texto do parâmetro se ele existir, senão pega o do input.
    const messageText = text !== null ? text : chatInput.value.trim();
    
    if (messageText === '') return;

    // Adiciona a mensagem do usuário na tela (mesmo que venha do botão, mostramos o "Sim" ou "Não")
    addMessage(messageText, 'user-message');
    
    // Limpa o input apenas se o texto veio de lá
    if (text === null) {
        chatInput.value = '';
    }

    // Continua o fluxo normal para a resposta do bot
    setTimeout(() => handleBotResponse(messageText), 600);
}

function handleBotResponse(userMessage) {
    const userMessageLower = userMessage.toLowerCase();

    if (awaitingConfirmation) {
        if (userMessageLower === 'sim' || userMessageLower === 's') {
            const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));
            modalCompra.show();
            addMessage(`Ótimo! Adicionei o ${productInConfirmation.nome} ao seu carrinho.`, 'bot-message');
        
        } else if (userMessageLower === 'não' || userMessageLower === 'nao' || userMessageLower === 'n') {
            addMessage('Ok, sem problemas. Posso te ajudar com mais alguma coisa?', 'bot-message');

        } else {
            addMessage("Desculpe, não entendi. Por favor, clique ou digite 'Sim' ou 'Não'.", 'bot-message');
            return;
        }

        awaitingConfirmation = false;
        productInConfirmation = null;
        return;
    }
    
    let produtoEncontrado = null;
    for (const produto of listaDeProdutos) {
        for (const keyword of produto.keywords) {
            if (userMessageLower.includes(keyword)) {
                produtoEncontrado = produto;
                break;
            }
        }
        if (produtoEncontrado) break;
    }

    if (produtoEncontrado) {
        addProductCard(produtoEncontrado);
        awaitingConfirmation = true;
        productInConfirmation = produtoEncontrado;
        return;
    }

    let categoriaEncontrada = null;
    for (const categoria of CATEGORIAS_PRODUTOS) {
        if (userMessageLower.includes(categoria.toLowerCase().split(' ')[0])) {
            categoriaEncontrada = categoria;
            break;
        }
    }
    
    if (categoriaEncontrada) {
        addMessage(`Claro! Temos ótimas opções de ${categoriaEncontrada}. Veja a seção correspondente na página.`, 'bot-message');
        return;
    }

    const categoriasFormatadas = CATEGORIAS_PRODUTOS.join(", ");
    addMessage(`Hum... não consegui identificar um produto ou categoria. Você pode perguntar sobre um item como "mouse razer" ou sobre uma categoria como "${categoriasFormatadas}".`, 'bot-message');
}

function addProductCard(produto) {
    const productCardHTML = `
        <div class="chatbot-product-card">
            <img src="${produto.image}" alt="${produto.nome}">
            <p>Encontrei o que você procura: <strong>${produto.nome}</strong></p>
            <p>Deseja finalizar a compra?</p>
            <div class="chatbot-confirmation-buttons">
                <button class="btn-confirm-yes" onclick="sendConfirmation('sim')">Sim</button>
                <button class="btn-confirm-no" onclick="sendConfirmation('não')">Não</button>
            </div>
        </div>
    `;
    addMessage(productCardHTML, 'bot-message', true);
}

// O 'onclick' dos botões chama esta função, que por sua vez chama a sendMessage CORRIGIDA
function sendConfirmation(response) {
    sendMessage(response);
}

// Função otimizada para adicionar mensagens
function addMessage(content, className, isHTML = false) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add(className);

    if (isHTML) {
        messageWrapper.innerHTML = content;
    } else {
        const textElement = document.createElement('p');
        textElement.textContent = content;
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