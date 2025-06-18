const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const rankElement = document.getElementById('rank');

let playerId;
let gameState = { players: [], collectibles: [] };

// Initialize game
socket.on('gameInit', (data) => {
  playerId = data.playerId;
  gameState = data.gameState;
  render();
});

// Update game state
socket.on('gameUpdate', (state) => {
  gameState = state;
  render();
});

// Handle keyboard input
const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  sendMovement();
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  sendMovement();
});

function sendMovement() {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;

  const speed = 5;
  let x = player.x;
  let y = player.y;

  if (keys['ArrowUp'] || keys['w']) y -= speed;
  if (keys['ArrowDown'] || keys['s']) y += speed;
  if (keys['ArrowLeft'] || keys['a']) x -= speed;
  if (keys['ArrowRight'] || keys['d']) x += speed;

  // Boundary checks
  x = Math.max(0, Math.min(790, x));
  y = Math.max(0, Math.min(590, y));

  socket.emit('playerMove', { x, y });
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw collectibles
  gameState.collectibles.forEach(collectible => {
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(collectible.x, collectible.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText(collectible.value, collectible.x - 3, collectible.y + 3);
  });
  
  // Draw players
  gameState.players.forEach(player => {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw player name and score
    ctx.fillStyle = 'black';
    ctx.fillText(`Player ${player.rank} (${player.score})`, player.x - 20, player.y - 20);
    
    // Highlight current player
    if (player.id === playerId) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Update score and rank display
      scoreElement.textContent = player.score;
      rankElement.textContent = player.rank;
    }
  });
}

// Animation loop
function gameLoop() {
  render();
  requestAnimationFrame(gameLoop);
}
gameLoop();