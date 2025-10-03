document.addEventListener("DOMContentLoaded", () => {
  const fontSizeSelect = document.getElementById("font-size");
  const resetBtn = document.getElementById("reset-default");
  const clearHistoryBtn = document.getElementById("clear-history");

  // Load saved font size
  const savedFont = localStorage.getItem("chatFontSize");
  if (savedFont) document.documentElement.style.setProperty("--font-size", savedFont);
  if (savedFont) fontSizeSelect.value = savedFont;

  // Change font size
  fontSizeSelect.addEventListener("change", () => {
    const size = fontSizeSelect.value + "px";
    document.documentElement.style.setProperty("--font-size", size);
    localStorage.setItem("chatFontSize", size);
  });

  // Reset to default
  resetBtn.addEventListener("click", () => {
    document.documentElement.style.setProperty("--font-size", "14px");
    fontSizeSelect.value = "14";
    localStorage.removeItem("chatFontSize");
  });

  // Clear chat history
  clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem("chatHistory"); // use this key to store chat if you save it
    alert("Chat history cleared!");
    // Optionally reload chat area
    const chatArea = document.querySelector(".chat-area");
    if (chatArea) chatArea.innerHTML = "";
  });
});
