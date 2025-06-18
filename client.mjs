// Add content security for dynamic elements
function safeCreateElement(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text; // Automatically escapes HTML
  return el;
}

// Escape HTML in any dynamic content
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Modify your render function to use safe methods
function render() {
  // ... existing canvas rendering code ...
  
  // Safe text rendering example
  const scoreDisplay = document.getElementById('score');
  scoreDisplay.textContent = player.score; // Use textContent not innerHTML
  
  const rankDisplay = document.getElementById('rank');
  rankDisplay.textContent = escapeHtml(player.calculateRank(gameState.players));
}