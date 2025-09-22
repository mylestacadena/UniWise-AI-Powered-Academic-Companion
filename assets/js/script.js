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

  // Send message from RASA
  async function sendMessage() {
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

    try {
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: message }),
      });

      const data = await response.json();
      typing.remove();

      if (data.length > 0) {
        data.forEach((msg) => {
          if (msg.text) {
            const botMsg = document.createElement("div");
            botMsg.classList.add("bot-msg");
            botMsg.textContent = msg.text;
            chatArea.appendChild(botMsg);
          }
        });
      } else {
        const botMsg = document.createElement("div");
        botMsg.classList.add("bot-msg");
        botMsg.textContent = "Sorry, I didn’t understand that.";
        chatArea.appendChild(botMsg);
      }

      chatArea.scrollTop = chatArea.scrollHeight;
    } catch (err) {
      typing.remove();
      console.error("Error:", err);
      const botMsg = document.createElement("div");
      botMsg.classList.add("bot-msg");
      botMsg.textContent = "⚠️ Cannot connect to server.";
      chatArea.appendChild(botMsg);
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }

  // Send button click
  sendBtn.addEventListener("click", sendMessage);

  // Enter key press
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
