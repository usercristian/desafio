const chatInput = document.querySelector('.chatbot-input-area input');
const sendButton = document.querySelector('.chatbot-input-area button');
const messagesContainer = document.querySelector('.chatbot-mensagens');

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
}

window.onload = () => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};