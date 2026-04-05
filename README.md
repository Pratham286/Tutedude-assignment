# Virtual Cosmos

A 2D virtual environment where users can move around and interact with each other in real time. When users come close, a chat connection is established. When they move apart, the chat disconnects — simulating real-world proximity-based interaction in a virtual space.

## Tech Stack

- **Frontend:** React (Vite), PixiJS, Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, MongoDB (Mongoose)

## Features

- **Real-Time Movement** — Move your avatar using WASD or Arrow keys across a 2D canvas
- **Multiplayer** — See other users moving in real time
- **Proximity-Based Chat** — Chat automatically connects when two users are within range and disconnects when they move apart
- **Chat History** — Messages persist even after disconnecting and reconnecting with the same user
- **Proximity Glow** — Visual indicator (glowing ring) appears on avatars when they are connected
- **Live HUD** — Navbar displays username, online user count, and live coordinates
- **MongoDB Persistence** — User sessions are saved with online status, last position, and last seen time
- **Optimized Performance** — Movement updates are throttled to reduce server load

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/virtual-cosmos.git
cd virtual-cosmos
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
PORT=3000
MONGO_URL=your_mongodb_connection_string
CORS_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

Go to `http://localhost:5173` in your browser. Open multiple tabs to test multiplayer.

## How It Works

1. User opens the app and enters a username
2. A PixiJS canvas renders the 2D world with a grid background
3. User moves their avatar using WASD or Arrow keys
4. Positions are synced in real time via Socket.IO
5. Server calculates distance between all users on every position update
6. If two users are within proximity radius — a chat room is created and both users see a chat panel
7. If they move apart — the chat room is closed and the panel disappears
8. All user sessions are persisted in MongoDB

## Project Structure

```
virtual-cosmos/
├── backend/
│   └── src/
│       ├── index.js              # Entry point — Express + Socket.IO + HTTP server
│       ├── app.js                # Express app config (CORS, middleware)
│       ├── db/
│       │   └── connection.js     # MongoDB connection
│       ├── models/
│       │   └── user.model.js     # User schema (username, position, status)
│       ├── socket/
│       │   ├── handler.js        # Socket event handlers (join, move, chat)
│       │   └── proximity.js      # Distance calculation + room ID generation
│       └── utils/
│           └── constants.js      # Map size, proximity radius
├── frontend/
│   └── src/
│       ├── App.jsx               # Main app — routes between JoinScreen and Canvas
│       ├── main.jsx              # Entry point with GameProvider
│       ├── services/
│       │   └── socket.js         # Socket.IO client connection
│       ├── context/
│       │   └── GameContext.jsx    # Global state (username, joined status)
│       ├── components/
│       │   ├── Canvas/
│       │   │   └── GameCanvas.jsx # PixiJS canvas, movement, game loop
│       │   ├── Chat/
│       │   │   └── ChatPanel.jsx  # Chat UI (messages, input)
│       │   ├── Screen/
│       │   │   └── JoinScreen.jsx # Username entry screen
│       │   └── UI/
│       │       └── Navbar.jsx     # Top bar (name, online count, coords)
│       └── utils/
│           └── constants.js      # Map size, speed, radius
└── README.md
```
