import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';
import Game from './Game.mjs';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Enhanced Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.socket.io"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "ws:"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'same-origin' }
}));

// Explicit security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff'); // Requirement 16
  res.setHeader('X-XSS-Protection', '1; mode=block'); // Requirement 17
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); // Requirement 18
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Powered-By', 'PHP 7.4.3'); // Requirement 19
  next();
});

// Serve static files with additional security
app.use(express.static('../client/public', {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
  }
}));

// Rest of your server code remains the same...