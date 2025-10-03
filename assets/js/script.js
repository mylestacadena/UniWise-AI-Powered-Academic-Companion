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

// ========================
// Owl-Kid Text-to-Speech Function
// ========================
function speakBotMessage(text) {
  if (!text) return;

  const synth = window.speechSynthesis;
  synth.cancel(); // stop any previous speech

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";

  // Pick Google UK English Female if available
  const voices = synth.getVoices();
  const selectedVoice = voices.find(v => v.name === "Google UK English Female") || voices[0];
  utter.voice = selectedVoice;

  // Slower, kid-friendly owl style
  utter.rate = 0.9 + Math.random() * 0.05;   // 0.9–0.95 speed (slower)
  utter.pitch = 1.3 + Math.random() * 0.2;   // 1.3–1.5 pitch (still playful)

  synth.speak(utter);
}

// Ensure voices are loaded (important on some browsers)
window.speechSynthesis.onvoiceschanged = () => {
  console.log("Available voices:", window.speechSynthesis.getVoices());
};


  // ========================
  // Display Bot Message
  // ========================
  function displayBotMessage(text) {
    const botMsg = document.createElement("div");
    botMsg.classList.add("bot-msg");
    botMsg.textContent = text;
    chatArea.appendChild(botMsg);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Speak the message
    speakBotMessage(text);
  }

  // ========================
  // Display Default Message
  // ========================
  function addDefaultMessage() {
    chatArea.innerHTML = "";
    displayBotMessage("👋 Welcome! You may ask anything.");
  }

  addDefaultMessage();

  // ========================
  // Toggle sidebar
  // ========================
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // ========================
  // Send message to Rasa
  // ========================
  async function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    // Display user message
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
          // Regular text
          if (msg.text) displayBotMessage(msg.text);

          // Buttons (if any)
          if (msg.buttons) {
            msg.buttons.forEach((btn) => {
              if (btn.title) displayBotMessage(btn.title);
            });
          }

          // Custom payloads
          if (msg.custom) {
            if (msg.custom.text) displayBotMessage(msg.custom.text);
            if (msg.custom.buttons) {
              msg.custom.buttons.forEach((btn) => {
                if (btn.title) displayBotMessage(btn.title);
              });
            }
          }
        });
      } else {
        displayBotMessage("Sorry, I didn’t understand that.");
      }
    } catch (err) {
      typing.remove();
      console.error("Error:", err);
      displayBotMessage("⚠️ Cannot connect to server.");
    }
  }

  // ========================
  // Send button click
  // ========================
  sendBtn.addEventListener("click", sendMessage);

  // ========================
  // Enter key press
  // ========================
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // ========================
  // New chat resets everything
  // ========================
  newChatBtn.addEventListener("click", () => {
    addDefaultMessage();
    suggestions.style.display = "block";
  });

  // ========================
  // Suggested questions
  // ========================
  suggestionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      inputField.value = btn.textContent;
      sendMessage();
    });
  });

  // ========================
  // Close suggestions
  // ========================
  closeSuggestions.addEventListener("click", () => {
    suggestions.style.display = "none";
  });
});





