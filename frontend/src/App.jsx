import { useEffect } from "react";
import "./App.css";
import socket from "./services/socket.js";
import { useGame } from "./context/GameContext.jsx";
import JoinScreen from "./components/Screen/JoinScreen.jsx";

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
        <div className="h-screen w-screen flex items-center justify-center" style={{ backgroundColor: "#071222", color: "#ffffff" }}>
            <h1 className="text-2xl">Welcome to the Cosmos! (Canvas coming next)</h1>
        </div>
    );
}

export default App;
