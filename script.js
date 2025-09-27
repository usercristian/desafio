// ------------------------
// Chatbot
// ------------------------
const chatInput = document.querySelector('.chatbot-input-area input');
const sendButton = document.querySelector('.chatbot-input-area button');
const messagesContainer = document.querySelector('.chatbot-mensagens');
const chatbot = document.querySelector('.chatbot');
const toggleChatBtn = document.getElementById('toggleChat');

// Array de categorias (para cumprir o requisito de arrays e funções)
const CATEGORIAS_PRODUTOS = [
    "Teclados",
    "Cadeiras",
    "Mesas",
    "Mouses",
    "Fones (Headsets)",
    "Monitores",
    "Acessórios"
];

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

// Função: enviar mensagem e manipular o DOM
function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    // Cria mensagem do usuário (Manipulação do DOM)
    const userMessageElement = document.createElement('p');
    // UX Writing: Usar uma classe para estilização (removendo estilo inline)
    userMessageElement.textContent = messageText;
    userMessageElement.classList.add('user-message'); 
    messagesContainer.appendChild(userMessageElement);

    chatInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Resposta automática do bot
    setTimeout(() => {
        handleBotResponse(messageText);
    }, 500);
}

// Função: lógica de resposta do bot (Utiliza o array de categorias)
function handleBotResponse(userMessage) {
    const categoriasFormatadas = CATEGORIAS_PRODUTOS.join(", ") + ".";
    const userMessageLower = userMessage.toLowerCase();

    if (conversationStep === 0) {
        addBotMessage(`Olá! Para te ajudar, qual destas categorias você procura? ${categoriasFormatadas}`);
        conversationStep = 1;
    } else if (conversationStep === 1) {
        let encontrou = false;
        
        // Percorre o array para verificar se a mensagem do usuário inclui alguma categoria (funções e arrays)
        for (const categoria of CATEGORIAS_PRODUTOS) {
            // Verifica o item, focando apenas na primeira palavra para simplificar
            if (userMessageLower.includes(categoria.toLowerCase().split(' ')[0])) {
                addBotMessage(`Ótimo! Encontrei as melhores opções de ${categoria} para você. Dê uma olhada na seção "${categoria}" logo abaixo!`);
                encontrou = true;
                break;
            }
        }

        if (!encontrou) {
            // UX Writing: Instrução clara de erro
            addBotMessage(`Hummm, não consegui entender o item. Por favor, digite o nome de uma das categorias: ${categoriasFormatadas}`);
        }
        conversationStep = 0; // Reseta a conversa para próxima pergunta
    }
}

// Função: adicionar mensagem do bot
function addBotMessage(text) {
    const botMessageElement = document.createElement('p');
    botMessageElement.textContent = text;
    messagesContainer.appendChild(botMessageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ------------------------
// Modal de compra (Melhoria de UX/Events)
// ------------------------
const comprarButtons = document.querySelectorAll('.comprar-btn');

document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('modalCompra');
    if (modalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modalCompra = new bootstrap.Modal(modalElement);
        
        comprarButtons.forEach(button => {
            // Evento para abrir o modal
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Evita qualquer comportamento padrão
                modalCompra.show();
                
                // Melhoria de UX: Feedback visual no botão (Events e Manipulação do DOM)
                const originalText = button.textContent;
                button.textContent = "Adicionado!";
                button.disabled = true;

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 1500); // Volta ao normal após 1.5s
            });
        });
    } else {
        // Fallback simples
        comprarButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert("Compra confirmada! Seu produto será enviado em breve. Obrigado por confiar na Happy Game!");
            });
        });
    }
});


// ------------------------
// Minimizar chat (Corrigido e melhorado o UX)
// ------------------------

// Função para manipular o estado do chat
function toggleChatState() {
    chatbot.classList.toggle('minimized');
    // UX Writing: Trocar o ícone para indicar o estado
    if (chatbot.classList.contains('minimized')) {
        toggleChatBtn.textContent = '+';
        toggleChatBtn.setAttribute('title', 'Abrir Chat');
    } else {
        toggleChatBtn.textContent = '–';
        toggleChatBtn.setAttribute('title', 'Minimizar Chat');
    }
}

toggleChatBtn.addEventListener('click', toggleChatState);

// No mobile, começa minimizado (Com melhoria no ícone e responsividade JS)
function initializeChatbot() {
    // Apenas aplica a minimização se a janela for pequena e o chat não estiver minimizado
    if (window.innerWidth <= 768 && !chatbot.classList.contains('minimized')) {
        chatbot.classList.add('minimized');
        toggleChatBtn.textContent = '+';
        toggleChatBtn.setAttribute('title', 'Abrir Chat');
    } else if (window.innerWidth > 768 && chatbot.classList.contains('minimized')) {
        // Se voltar para desktop, remove o estado minimizado
        chatbot.classList.remove('minimized');
        toggleChatBtn.textContent = '–';
        toggleChatBtn.setAttribute('title', 'Minimizar Chat');
    }
}

window.addEventListener('load', initializeChatbot);
// Evento para garantir que a responsividade do chat funcione ao redimensionar
window.addEventListener('resize', initializeChatbot);