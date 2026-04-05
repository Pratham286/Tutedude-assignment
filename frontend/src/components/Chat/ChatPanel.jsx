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
        <div className="flex flex-col rounded-xl overflow-hidden shadow-md bg-white border border-gray-200" style={{ width: "320px", height: "400px" }}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm font-semibold text-white">
                        {otherUser}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition text-lg leading-none"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 bg-gray-50">
                {messages.length === 0 && (
                    <p className="text-center text-xs text-gray-400">
                        You're connected! Say hello 👋
                    </p>
                )}
                {messages.map((msg, i) => {
                    const isMe = msg.senderId === socket.id;
                    return (
                        <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <span className="text-xs mb-1 text-gray-400">
                                {isMe ? "You" : msg.username}
                            </span>
                            <div
                                className={`px-3 py-2 rounded-lg text-sm max-w-[220px] break-words ${
                                    isMe
                                        ? "bg-gray-800 text-white"
                                        : "bg-white text-gray-800 border border-gray-200"
                                }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 px-3 py-3 bg-white border-t border-gray-200">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none border border-gray-300 focus:ring-2 focus:ring-gray-400 placeholder-gray-400 text-gray-800"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-40 bg-gray-800 text-white hover:bg-gray-900"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;