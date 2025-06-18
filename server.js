const express = require('express');
const helmet = require('helmet');
const http = require('http');
const socketio = require('socket.io');
const Game = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Security middleware
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// Serve static files
app.use(express.static('../client'));

// Game instance
const game = new Game();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New player connected:', socket.id);
  
  // Add new player to game
  game.addPlayer(socket.id);
  
  // Send initial game state
  socket.emit('gameInit', {
    playerId: socket.id,
    gameState: game.getPublicState()
  });
  
  // Handle player movement
  socket.on('playerMove', (moveData) => {
    game.handlePlayerMove(socket.id, moveData);
    io.emit('gameUpdate', game.getPublicState());
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    game.removePlayer(socket.id);
    io.emit('gameUpdate', game.getPublicState());
    console.log('Player disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});