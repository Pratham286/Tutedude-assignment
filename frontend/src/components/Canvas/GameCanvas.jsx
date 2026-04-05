import { useEffect, useRef, useState } from "react";
import { Application, Graphics, Text, Container } from "pixi.js";
import socket from "../../services/socket";
import { useGame } from "../../context/GameContext";
import { MAP_WIDTH, MAP_HEIGHT, MOVE_SPEED } from "../../utils/constants";
import ChatPanel from "../Chat/ChatPanel";
import Navbar from "../Screen/Navbar";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const playerRef = useRef(null);
  const playersRef = useRef(new Map());
  const keysRef = useRef(new Set());
  const worldRef = useRef(null);
  const hasJoinedRef = useRef(false);
  const connectedIdsRef = useRef(new Set());
  const lastEmitRef = useRef(0);
  const { username, setJoined, setUsername } = useGame();

  const [activeChats, setActiveChats] = useState([]);
  const [minimizedChats, setMinimizedChats] = useState(new Set());
  const [onlineCount, setOnlineCount] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const chatMessagesRef = useRef(new Map());

  useEffect(() => {
    let keyDownHandler = null;
    let keyUpHandler = null;

    const initApp = async () => {
      if (appRef.current) return;

      const app = new Application();

      await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xf0f4f8,
    resizeTo: window,
    antialias: true,
});

      if (!canvasRef.current) {
        app.destroy(true);
        return;
      }

      canvasRef.current.appendChild(app.canvas);
      appRef.current = app;

      const world = new Container();
      app.stage.addChild(world);
      worldRef.current = world;

      drawGrid(world);

      socket.on("user:joined", ({ user, users }) => {
        if (playerRef.current) return;

        const player = createAvatar(user.username, 0x1e40af);
        player.x = user.x;
        player.y = user.y;
        playerRef.current = player;
        world.addChild(player);

        users.forEach((u) => {
          if (u.id !== socket.id && !playersRef.current.has(u.id)) {
            const other = createAvatar(u.username, 0x4338ca);
            other.x = u.x;
            other.y = u.y;
            playersRef.current.set(u.id, other);
            world.addChild(other);
            setPosition({ x: user.x, y: user.y });
            setOnlineCount(users.length);
          }
        });
      });

      socket.on("user:new", (user) => {
        if (playersRef.current.has(user.id)) return;
        const other = createAvatar(user.username, 0x4338ca);
        other.x = user.x;
        other.y = user.y;
        playersRef.current.set(user.id, other);
        world.addChild(other);
        setOnlineCount((prev) => prev + 1);
      });

      socket.on("user:moved", ({ id, x, y }) => {
        const other = playersRef.current.get(id);
        if (other) {
          other.x = x;
          other.y = y;
        }
      });

      socket.on("user:left", (id) => {
        const other = playersRef.current.get(id);
        if (other) {
          world.removeChild(other);
          other.destroy();
          playersRef.current.delete(id);
          connectedIdsRef.current.delete(id);
          setOnlineCount((prev) => Math.max(1, prev - 1));
        }
      });

      socket.on("chat:connected", ({ roomId, users }) => {
        setActiveChats((prev) => {
          if (prev.find((c) => c.roomId === roomId)) return prev;
          const otherUser = users.find((u) => u.id !== socket.id);
          return [
            ...prev,
            { roomId, otherUser: otherUser?.username || "Unknown" },
          ];
        });
        setMinimizedChats((prev) => {
          const next = new Set(prev);
          next.delete(roomId);
          return next;
        });

        const otherId = users.find((u) => u.id !== socket.id)?.id;
        if (otherId) connectedIdsRef.current.add(otherId);
      });
      socket.on("chat:disconnected", ({ roomId }) => {
        const ids = roomId.replace("chat_", "").split("_");
        const otherId = ids.find((id) => id !== socket.id);
        if (otherId) connectedIdsRef.current.delete(otherId);

        setActiveChats((prev) => prev.filter((c) => c.roomId !== roomId));
        setMinimizedChats((prev) => {
          const next = new Set(prev);
          next.delete(roomId);
          return next;
        });
      });

      socket.on(
        "chat:message",
        ({ roomId, senderId, username, message, timestamp }) => {
          const existing = chatMessagesRef.current.get(roomId) || [];
          chatMessagesRef.current.set(roomId, [
            ...existing,
            { senderId, username, message, timestamp },
          ]);
          // Force re-render to show new message
          setActiveChats((prev) => [...prev]);
        },
      );

      if (!hasJoinedRef.current) {
        hasJoinedRef.current = true;
        socket.emit("user:join", { username });
      }

      keyDownHandler = (e) => {
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
            e.key,
          )
        ) {
          e.preventDefault();
        }
        keysRef.current.add(e.key.toLowerCase());
      };
      keyUpHandler = (e) => keysRef.current.delete(e.key.toLowerCase());

      window.addEventListener("keydown", keyDownHandler);
      window.addEventListener("keyup", keyUpHandler);

      app.ticker.add(() => {
        const player = playerRef.current;
        if (!player) return;

        const keys = keysRef.current;
        let moved = false;

        if ((keys.has("w") || keys.has("arrowup")) && player.y > 20) {
          player.y -= MOVE_SPEED;
          moved = true;
        }
        if (
          (keys.has("s") || keys.has("arrowdown")) &&
          player.y < MAP_HEIGHT - 20
        ) {
          player.y += MOVE_SPEED;
          moved = true;
        }
        if ((keys.has("a") || keys.has("arrowleft")) && player.x > 20) {
          player.x -= MOVE_SPEED;
          moved = true;
        }
        if (
          (keys.has("d") || keys.has("arrowright")) &&
          player.x < MAP_WIDTH - 20
        ) {
          player.x += MOVE_SPEED;
          moved = true;
        }

        // if (moved) {
        //   socket.emit("user:move", { x: player.x, y: player.y });
        //   setPosition({ x: player.x, y: player.y });
        // }
        if (moved) {
          setPosition({ x: player.x, y: player.y });
          const now = Date.now();
          if (now - lastEmitRef.current > 50) {
            socket.emit("user:move", { x: player.x, y: player.y });
            lastEmitRef.current = now;
          }
        }
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        world.x = -player.x + screenW / 2;
        world.y = -player.y + screenH / 2;
        world.x = Math.min(0, Math.max(world.x, -MAP_WIDTH + screenW));
        world.y = Math.min(0, Math.max(world.y, -MAP_HEIGHT + screenH));

        // Update glow visibility
        const connected = connectedIdsRef.current;

        const myGlow = player.children.find((c) => c.label === "glow");
        if (myGlow) myGlow.visible = connected.size > 0;

        playersRef.current.forEach((avatar, id) => {
          const glow = avatar.children.find((c) => c.label === "glow");
          if (glow) glow.visible = connected.has(id);
        });
      });
    };

    initApp();

    return () => {
      socket.off("user:joined");
      socket.off("user:new");
      socket.off("user:moved");
      socket.off("user:left");
      socket.off("chat:connected");
      socket.off("chat:disconnected");
      socket.off("chat:message");

      if (keyDownHandler) window.removeEventListener("keydown", keyDownHandler);
      if (keyUpHandler) window.removeEventListener("keyup", keyUpHandler);

      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  const handleMinimize = (roomId) => {
    setMinimizedChats((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        next.delete(roomId);
      } else {
        next.add(roomId);
      }
      return next;
    });
  };

  const handleLeave = () => {
    socket.disconnect();
    socket.connect();
    setJoined(false);
    setUsername("");
};

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={canvasRef} className="w-full h-full" />
      <Navbar username={username} onlineCount={onlineCount} position={position} onLeave={handleLeave} />
      {/* Chat panels - positioned bottom right */}
      <div className="fixed bottom-4 right-4 flex flex-row-reverse items-end gap-3 z-50">
        {activeChats.map((chat) =>
          minimizedChats.has(chat.roomId) ? (
            <button
    key={chat.roomId}
    onClick={() => handleMinimize(chat.roomId)}
    className="px-4 py-2 rounded-full text-sm font-semibold shadow-md bg-gray-800 text-white hover:bg-gray-900"
>
    {chat.otherUser}
</button>
          ) : (
            <ChatPanel
              key={chat.roomId}
              roomId={chat.roomId}
              otherUser={chat.otherUser}
              messages={chatMessagesRef.current.get(chat.roomId) || []}
              onClose={() => handleMinimize(chat.roomId)}
            />
          ),
        )}
      </div>

      {/* Connection indicator - top right */}
      {activeChats.length > 0 && (
    <div className="fixed top-14 right-4 flex items-center gap-2 px-3 py-1 rounded-full z-50 bg-blue-500/15 backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
        <span className="text-xs font-semibold text-blue-400">
            {activeChats.length} active{" "}
            {activeChats.length === 1 ? "connection" : "connections"}
        </span>
    </div>
)}
    </div>
  );
};

const createAvatar = (name, color) => {
    const container = new Container();

    // Proximity glow ring - hidden by default
    const glow = new Graphics()
        .circle(0, 0, 40)
        .stroke({ width: 3, color: 0x3b82f6, alpha: 0.3 });
    glow.visible = false;
    glow.label = "glow";
    container.addChild(glow);

    // Shadow
    const shadow = new Graphics()
        .circle(0, 4, 22)
        .fill({ color: 0x000000, alpha: 0.08 });
    container.addChild(shadow);

    // White filled circle
    const body = new Graphics()
        .circle(0, 0, 22)
        .fill({ color: 0xffffff });
    container.addChild(body);

    // Colored border
    const border = new Graphics()
        .circle(0, 0, 22)
        .stroke({ width: 3, color: color });
    container.addChild(border);

    // First letter inside the circle
    const initial = new Text({
        text: name.charAt(0).toUpperCase(),
        style: {
            fontSize: 18,
            fill: color,
            fontFamily: "Arial",
            fontWeight: "bold",
        },
    });
    initial.anchor.set(0.5);
    initial.y = 0;
    container.addChild(initial);

    // Username label below avatar
    const label = new Text({
        text: name,
        style: {
            fontSize: 12,
            fill: 0x475569,
            fontFamily: "Arial",
            fontWeight: "bold",
        },
    });
    label.anchor.set(0.5);
    label.y = 32;
    container.addChild(label);

    return container;
};

const drawGrid = (world) => {
    const bg = new Graphics()
        .rect(0, 0, MAP_WIDTH, MAP_HEIGHT)
        .fill({ color: 0xf8fafc });
    world.addChild(bg);

    const spacing = 80;
    const lines = new Graphics();

    for (let x = 0; x <= MAP_WIDTH; x += spacing) {
        lines.moveTo(x, 0);
        lines.lineTo(x, MAP_HEIGHT);
    }
    for (let y = 0; y <= MAP_HEIGHT; y += spacing) {
        lines.moveTo(0, y);
        lines.lineTo(MAP_WIDTH, y);
    }
    lines.stroke({ width: 1, color: 0x0f172a, alpha: 0.2 });
    world.addChild(lines);

    const border = new Graphics()
        .rect(0, 0, MAP_WIDTH, MAP_HEIGHT)
        .stroke({ width: 2, color: 0x0f172a, alpha: 0.15 });
    world.addChild(border);
};

export default GameCanvas;
