P2P File Transfer App

A peer-to-peer file transfer web application built with React, WebRTC, and Socket.IO. Transfer files directly between browsers without any server storage.

## Features

- Direct P2P Transfer - Files never touch a server
- Large File Support - Send files of any size
- Mobile Responsive - Works on phones, tablets, and desktops
- Private and Secure - End-to-end encrypted WebRTC connection
- Dark/Light Mode - Theme toggle with system preference detection
- Real-time Progress - Speed, percentage, and time remaining
- QR Code Sharing - Easy sharing with mobile devices

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- PeerJS (WebRTC)

### Backend
- Express
- Socket.IO
- TypeScript

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Local Development

1. Clone the repository
https://github.com/devTemilorun/devTemilorun-devtemilorun-file-transfer-app   
cd file-transfer-app


# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm 


Set up environment variables

Create .env files:

env
VITE_APP_URL=http://localhost:5173
VITE_SIGNALING_URL=http://localhost:3001


server/.env:
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173


Start the app

Terminal 1 (Server):
cd server
npm run dev

Terminal 2 (Client):
cd client
npm run dev
Open your browser

http://localhost:5173



Project Structure

file-transfer-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── context/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   └── index.ts
│   └── package.json
├── shared/
│   └── types.ts
├── railway.json
├── package.json
└── README.md


How It Works
1. Sender selects files and creates a share link
2. Receiver opens the link or scans QR code
3. Signaling server introduces both browsers
4. WebRTC establishes direct peer-to-peer connection
5. Files transfer directly between browsers
6. Progress shows in real-time



Author
Built by devTemilorun