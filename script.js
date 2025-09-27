// ------------------------
// Chatbot
// ------------------------
const chatInput = document.querySelector('.chatbot-input-area input');
const sendButton = document.querySelector('.chatbot-input-area button');
const messagesContainer = document.querySelector('.chatbot-mensagens');
const chatbot = document.querySelector('.chatbot');
const toggleChatBtn = document.getElementById('toggleChat');

// Estado da conversa
let conversationStep = 0;

// Evento: enviar mensagem pelo botão
sendButton.addEventListener('click', () => {
    sendMessage();
});

// Evento: enviar mensagem com Enter
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Função: enviar mensagem
function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    // Cria mensagem do usuário
    const userMessageElement = document.createElement('p');
    userMessageElement.textContent = messageText;
    userMessageElement.style.backgroundColor = '#d1f7ff';
    userMessageElement.style.textAlign = 'right';
    messagesContainer.appendChild(userMessageElement);

    chatInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Resposta automática do bot
    setTimeout(() => {
        handleBotResponse(messageText);
    }, 500);
}

// Função: lógica de resposta do bot
function handleBotResponse(userMessage) {
    if (conversationStep === 0) {
        addBotMessage("Certo, me diga qual categoria você procura: Teclados, Cadeiras ou Mesas?");
        conversationStep = 1;
    } else if (conversationStep === 1) {
        if (userMessage.toLowerCase().includes("teclado")) {
            addBotMessage("Encontrei alguns teclados disponíveis na seção Teclados.");
        } else if (userMessage.toLowerCase().includes("cadeira")) {
            addBotMessage("Veja nossas opções de cadeiras na seção Cadeiras.");
        } else if (userMessage.toLowerCase().includes("mesa")) {
            addBotMessage("Temos mesas disponíveis na seção Mesas.");
        } else {
            addBotMessage("Não entendi bem. Você pode repetir usando Teclados, Cadeiras ou Mesas?");
        }
        conversationStep = 0; // reseta a conversa
    }
}

// Função: adicionar mensagem do bot
function addBotMessage(text) {
    const botMessageElement = document.createElement('p');
    botMessageElement.textContent = text;
    botMessageElement.style.backgroundColor = '#ffffff';
    botMessageElement.style.border = "1px solid #ddd";
    botMessageElement.style.textAlign = 'left';
    messagesContainer.appendChild(botMessageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ------------------------
// Modal de compra
// ------------------------
const comprarButtons = document.querySelectorAll('.comprar-btn');
const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));

comprarButtons.forEach(button => {
    button.addEventListener('click', () => {
        modalCompra.show();
    });
});

// ------------------------
// Minimizar chat
// ------------------------
toggleChatBtn.addEventListener('click', () => {
    chatbot.classList.toggle('minimized');
});

// No mobile, começa minimizado
if (window.innerWidth <= 768) {
    chatbot.classList.add('minimized');
}
