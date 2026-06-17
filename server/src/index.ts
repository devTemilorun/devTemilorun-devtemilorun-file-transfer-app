import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

interface SignalingRoom {
  senderId: string;
  receiverId?: string;
}

const rooms = new Map<string, SignalingRoom>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('register', ({ peerId }) => {
    socket.data.peerId = peerId;
    console.log(`Peer registered: ${peerId}`);
  });
  
  socket.on('create-room', ({ sessionId, peerId }) => {
    rooms.set(sessionId, { senderId: peerId });
    socket.join(sessionId);
    console.log(`Room created: ${sessionId} by ${peerId}`);
    socket.emit('room-created', { sessionId });
  });
  
  socket.on('join-room', ({ sessionId, peerId }) => {
    const room = rooms.get(sessionId);
    if (room && !room.receiverId) {
      room.receiverId = peerId;
      socket.join(sessionId);
      io.to(sessionId).emit('peer-joined', { senderId: room.senderId, receiverId: peerId });
      console.log(`Peer ${peerId} joined room ${sessionId}`);
    } else {
      socket.emit('room-error', { message: 'Room not found or already occupied' });
    }
  });
  
  socket.on('offer', ({ sessionId, offer }) => {
    socket.to(sessionId).emit('offer', { offer, from: socket.id });
  });
  
  socket.on('answer', ({ sessionId, answer }) => {
    socket.to(sessionId).emit('answer', { answer, from: socket.id });
  });
  
  socket.on('ice-candidate', ({ sessionId, candidate }) => {
    socket.to(sessionId).emit('ice-candidate', { candidate, from: socket.id });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Clean up rooms
    for (const [sessionId, room] of rooms.entries()) {
      if (room.senderId === socket.data.peerId || room.receiverId === socket.data.peerId) {
        rooms.delete(sessionId);
        io.to(sessionId).emit('peer-disconnected');
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});