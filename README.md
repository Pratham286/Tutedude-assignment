# Virtual Cosmos

A 2D virtual environment where users can move around and interact with each other in real time. When users come close, a chat connection is established. When they move apart, the chat disconnects — simulating real-world proximity-based interaction in a virtual space.

## Tech Stack

- **Frontend:** React (Vite), PixiJS, Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, MongoDB

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


## Optimisations

1. **Movement Throttling** — Position updates are emitted to the server every 50ms instead of every frame, reducing network traffic by 66% while keeping local movement smooth at 60fps.

2. **useRef Over useState for Game Data** — All real-time game data (player positions, key presses, connected users) is stored in React refs instead of state. This prevents unnecessary re-renders that would otherwise fire 60 times per second.

3. **In-Memory Storage for Real-Time Data** — Active user positions and connections are stored in a server-side JavaScript Map for instant reads/writes. MongoDB is only used for persistent data (user profiles on join/disconnect), avoiding expensive database calls on every movement.

4. **Broadcast Over Emit** — Position updates use `socket.broadcast.emit` instead of `io.emit`, ensuring the server never sends a user their own position data back, reducing unnecessary messages by one per update.
