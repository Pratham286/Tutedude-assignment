import { useEffect } from "react";
import "./App.css";
import socket from "./services/socket.js";
import { useGame } from "./context/GameContext.jsx";
import JoinScreen from "./components/Screen/JoinScreen.jsx";
import GameCanvas from "./components/Canvas/GameCanvas.jsx";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server : ", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected to server : ", socket.id);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  const { joined } = useGame();

    if (!joined) return <JoinScreen />;

    return (
        <GameCanvas />
    );
}

export default App;
