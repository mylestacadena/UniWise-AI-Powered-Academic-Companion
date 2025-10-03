// script.js
document.addEventListener("DOMContentLoaded", () => {
  // ---------- Sidebar toggle ----------
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector(".toggle-btn");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // ---------- Chat elements ----------
  const chatBox = document.querySelector(".chat-box");
  const chatArea = document.getElementById("chatBox");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const newChatBtn = document.getElementById("newChatBtn");

  // Suggestions
  const suggestions = document.getElementById("suggestions");
  const suggestionBtns = document.querySelectorAll("#suggestions button");
  const closeSuggestions = document.getElementById("closeSuggestions");

  let firstMessageSent = false;

  // ========================
  // TTS Function
  // ========================
  function speakBotMessage(text) {
    if (!text) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-GB";
    const voices = synth.getVoices();
    const selectedVoice =
      voices.find((v) => v.name === "Google UK English Female") || voices[0];
    utter.voice = selectedVoice;
    utter.rate = 1.0;
    utter.pitch = 1.0;

    synth.speak(utter);
  }
  window.speechSynthesis.onvoiceschanged = () =>
    console.log("Voices loaded:", window.speechSynthesis.getVoices());

  // ========================
  // Display Bot Message
  // ========================
  function displayBotMessage(text) {
    const botMsg = document.createElement("div");
    botMsg.className = "bot-msg";
    botMsg.textContent = text;
    chatArea.appendChild(botMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
    speakBotMessage(text);
  }

  // ========================
  // Default Welcome
  // ========================
  function addDefaultMessage() {
    if (!chatArea) return;
    chatArea.innerHTML = "";
    displayBotMessage("👋 Welcome! You may ask anything.");
    if (chatBox) chatBox.classList.remove("active");
    firstMessageSent = false;
    if (suggestions) suggestions.style.display = "block";
  }
  addDefaultMessage();

  // ========================
  // Send Message (with Rasa)
  // ========================
  async function sendMessage() {
    if (!chatInput || !chatArea) return;
    const text = chatInput.value.trim();
    if (!text) return;

    // expand chat on first user msg
    if (!firstMessageSent && chatBox) {
      chatBox.classList.add("active");
      firstMessageSent = true;
      if (suggestions) suggestions.style.display = "none";
    }

    // user message
    const userMsg = document.createElement("div");
    userMsg.className = "user-msg";
    userMsg.textContent = text;
    chatArea.appendChild(userMsg);
    chatInput.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;

    // typing indicator
    const typing = document.createElement("div");
    typing.className = "typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: text }),
      });

      const data = await response.json();
      typing.remove();

      if (data.length > 0) {
        data.forEach((msg) => {
          if (msg.text) displayBotMessage(msg.text);

          if (msg.buttons) {
            msg.buttons.forEach((btn) => {
              if (btn.title) displayBotMessage(btn.title);
            });
          }

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

  // Send button + Enter key
  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      addDefaultMessage();
    });
  }

  // Suggestions
  suggestionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.textContent;
      sendMessage();
    });
  });
  if (closeSuggestions) {
    closeSuggestions.addEventListener("click", () => {
      suggestions.style.display = "none";
    });
  }

  // ========================
  // Settings (modal)
  // ========================
  const settingsModalEl = document.getElementById("settingsModal");
  const bsModal = settingsModalEl
    ? (bootstrap.Modal.getInstance(settingsModalEl) ||
        new bootstrap.Modal(settingsModalEl))
    : null;

  const fontSizeInput = document.getElementById("fontSize");
  const glowColorInput = document.getElementById("glowColor");
  const saveBtn = document.getElementById("saveSettings");
  const resetBtn = document.getElementById("resetSettings");
  const clearBtn = document.getElementById("clearHistory");

  const DEFAULT_FONT = 16; // px
  const DEFAULT_GLOW = "#ffffff";

  function applyFontSize(v) {
    document.documentElement.style.setProperty(
      "--font-size",
      (v || DEFAULT_FONT) + "px"
    );
  }
  function applyGlowColor(hex) {
    document.documentElement.style.setProperty(
      "--chat-glow",
      hex || DEFAULT_GLOW
    );
  }

  const savedFont = localStorage.getItem("chatFontSize");
  const savedGlow = localStorage.getItem("chatGlowColor");

  if (fontSizeInput) fontSizeInput.value = savedFont || DEFAULT_FONT;
  if (glowColorInput) glowColorInput.value = savedGlow || DEFAULT_GLOW;

  applyFontSize(savedFont || DEFAULT_FONT);
  applyGlowColor(savedGlow || DEFAULT_GLOW);

  if (fontSizeInput) {
    fontSizeInput.addEventListener("input", (e) => {
      applyFontSize(e.target.value);
    });
  }
  if (glowColorInput) {
    glowColorInput.addEventListener("input", (e) => {
      applyGlowColor(e.target.value);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const fontVal = fontSizeInput ? fontSizeInput.value : DEFAULT_FONT;
      const glowVal = glowColorInput ? glowColorInput.value : DEFAULT_GLOW;

      localStorage.setItem("chatFontSize", fontVal);
      localStorage.setItem("chatGlowColor", glowVal);

      applyFontSize(fontVal);
      applyGlowColor(glowVal);

      if (bsModal) bsModal.hide();
      try {
        alert("Settings saved.");
      } catch (e) {}
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (fontSizeInput) fontSizeInput.value = DEFAULT_FONT;
      if (glowColorInput) glowColorInput.value = DEFAULT_GLOW;

      applyFontSize(DEFAULT_FONT);
      applyGlowColor(DEFAULT_GLOW);

      localStorage.removeItem("chatFontSize");
      localStorage.removeItem("chatGlowColor");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("chatHistory");
      if (chatArea) {
        chatArea.innerHTML = "";
        addDefaultMessage();
      }
      try {
        alert("Chat history cleared.");
      } catch (e) {}
    });
  }
});
