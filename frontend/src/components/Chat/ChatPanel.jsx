import { useState, useRef, useEffect } from "react";
import socket from "../../services/socket";

const ChatPanel = ({ roomId, otherUser, messages, onClose }) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        socket.emit("chat:message", { roomId, message: trimmed });
        setInput("");
    };

    const handleKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === "Enter") handleSend();
    };

    return (
        <div
            className="flex flex-col rounded-xl overflow-hidden shadow-lg"
            style={{ backgroundColor: "#0f2035", border: "1px solid #1e3a5f", width: "320px", height: "400px" }}
        >
            <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: "#0a1a2e", borderBottom: "1px solid #1e3a5f" }}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm font-semibold" style={{ color: "#38bdf8" }}>
                        {otherUser}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-white transition text-lg leading-none"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ backgroundColor: "#071222" }}>
                {messages.length === 0 && (
                    <p className="text-center text-xs" style={{ color: "#475569" }}>
                        You're connected! Say hello 👋
                    </p>
                )}
                {messages.map((msg, i) => {
                    const isMe = msg.senderId === socket.id;
                    return (
                        <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <span className="text-xs mb-1" style={{ color: "#64748b" }}>
                                {isMe ? "You" : msg.username}
                            </span>
                            <div
                                className="px-3 py-2 rounded-lg text-sm max-w-[220px] break-words"
                                style={{
                                    backgroundColor: isMe ? "#38bdf8" : "#1e3a5f",
                                    color: isMe ? "#071222" : "#ffffff",
                                }}
                            >
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 px-3 py-3" style={{ backgroundColor: "#0a1a2e", borderTop: "1px solid #1e3a5f" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none placeholder-gray-500"
                    style={{ backgroundColor: "#071222", color: "#ffffff" }}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-40"
                    style={{ backgroundColor: "#38bdf8", color: "#071222" }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;