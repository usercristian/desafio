const chatInput = document.querySelector('.chatbot-input-area input');
const sendButton = document.querySelector('.chatbot-input-area button');
const messagesContainer = document.querySelector('.chatbot-mensagens');

let conversationState = 0;

sendButton.addEventListener('click', () => {
    sendMessage();
});

chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = chatInput.value.trim();

    if (messageText === '') {
        return;
    }

    const userMessageElement = document.createElement('p');
    userMessageElement.textContent = messageText;
    userMessageElement.style.backgroundColor = '#dcf8c6';
    userMessageElement.style.alignSelf = 'flex-end';
    messagesContainer.appendChild(userMessageElement);

    chatInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
        if (conversationState === 0) {
            addBotMessage("Olá! Qual item você deseja?");
            conversationState = 1;
        } else if (conversationState === 1) {
            const produtos = document.querySelectorAll('.produto-item');
            const terceiroProduto = produtos[2];

            const nomeProduto = terceiroProduto.querySelector('h3').textContent;
            const precoProduto = terceiroProduto.querySelector('p').textContent;

            const botResponseHTML = `
                Encontrei este item para você: <strong>${nomeProduto}</strong> por <strong>${precoProduto}</strong>.
                <br><br>
                <button class="comprar-btn" onclick="handlePurchase()">Comprar</button>
            `;
            addBotMessage(botResponseHTML);
            conversationState = 2;
        }
    }, 500);
}

function addBotMessage(htmlContent) {
    const botMessageElement = document.createElement('p');
    botMessageElement.innerHTML = htmlContent;
    messagesContainer.appendChild(botMessageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handlePurchase() {
    addBotMessage("Obrigado pela sua compra!");
    conversationState = 0; 
}

window.onload = () => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};