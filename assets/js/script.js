document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector(".toggle-btn");
  const inputField = document.querySelector(".input-area input");
  const sendBtn = document.querySelector(".send-btn");
  const chatArea = document.querySelector(".chat-area");
  const newChatBtn = document.querySelector(".new-chat");
  const suggestions = document.querySelector(".suggestions");
  const suggestionBtns = document.querySelectorAll(".suggestion-buttons button");
  const closeSuggestions = document.querySelector(".close-suggestions");

  // Default bot message
  function addDefaultMessage() {
    chatArea.innerHTML = "";
    const defaultMsg = document.createElement("div");
    defaultMsg.classList.add("bot-msg");
    defaultMsg.textContent = "👋 Welcome! You may ask anything.";
    chatArea.appendChild(defaultMsg);
  }

  addDefaultMessage();

  // Toggle sidebar
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Send message
  function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    const userMsg = document.createElement("div");
    userMsg.classList.add("user-msg");
    userMsg.textContent = message;
    chatArea.appendChild(userMsg);

    inputField.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;

    // Typing indicator
    const typing = document.createElement("div");
    typing.classList.add("typing-indicator");
    typing.innerHTML = "<span></span><span></span><span></span>";
    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Fake bot reply
    setTimeout(() => {
      typing.remove();
      const botMsg = document.createElement("div");
      botMsg.classList.add("bot-msg");
      botMsg.textContent = "🤖 This is a bot reply.";
      chatArea.appendChild(botMsg);
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 1000);
  }

  sendBtn.addEventListener("click", sendMessage);
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // New chat resets everything
  newChatBtn.addEventListener("click", () => {
    addDefaultMessage();
    suggestions.style.display = "block";
  });

  // Suggested questions
  suggestionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      inputField.value = btn.textContent;
      sendMessage();
    });
  });

  // Close suggestions
  closeSuggestions.addEventListener("click", () => {
    suggestions.style.display = "none";
  });
});
