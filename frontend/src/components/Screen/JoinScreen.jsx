import { useState } from "react";
import { useGame } from "../../context/GameContext.jsx";

const JoinScreen = () => {
    const [input, setInput] = useState("");
    const { setUsername, setJoined } = useGame();

    const handleJoin = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        setUsername(trimmed);
        setJoined(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleJoin();
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center" style={{ backgroundColor: "#071222" }}>
            <div className="p-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 w-80" style={{ backgroundColor: "#0f2035" }}>
                <h1 className="text-3xl font-bold" style={{ color: "#38bdf8" }}>Virtual Cosmos</h1>
                <p className="text-sm text-center" style={{ color: "#94a3b8" }}>
                    Enter your name to join the cosmos
                </p>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your name..."
                    maxLength={15}
                    className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2 placeholder-gray-500"
                    style={{ backgroundColor: "#071222", color: "#ffffff" }}
                />
                <button
                    onClick={handleJoin}
                    disabled={!input.trim()}
                    className="w-full py-2 rounded-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ backgroundColor: "#38bdf8", color: "#071222" }}
                >
                    Enter Cosmos
                </button>
            </div>
        </div>
    );
};

export default JoinScreen;