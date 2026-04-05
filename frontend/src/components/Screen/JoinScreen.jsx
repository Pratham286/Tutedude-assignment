import { useState } from "react";
import { useGame } from "../../context/GameContext";

const JoinScreen = () => {
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
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
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

                .join-screen {
                    font-family: 'Outfit', sans-serif;
                    min-height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0f4f8;
                    position: relative;
                    overflow: hidden;
                }

                .join-screen::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: 
                        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
                        radial-gradient(circle at 50% 80%, rgba(14, 165, 233, 0.05) 0%, transparent 50%);
                    animation: float 20s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(2%, -2%) rotate(1deg); }
                    66% { transform: translate(-1%, 1%) rotate(-1deg); }
                }

                .grid-bg {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
                    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
                }

                .join-card {
                    position: relative;
                    z-index: 10;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(59, 130, 246, 0.1);
                    border-radius: 24px;
                    padding: 48px 40px;
                    width: 380px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 
                        0 4px 6px -1px rgba(0, 0, 0, 0.05),
                        0 20px 40px -8px rgba(59, 130, 246, 0.1);
                    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }

                @keyframes cardIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .cosmos-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 8px;
                    box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.3);
                }

                .cosmos-icon svg {
                    width: 28px;
                    height: 28px;
                    color: white;
                }

                .title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 28px;
                    font-weight: 700;
                    color: #1e293b;
                    letter-spacing: -0.5px;
                    margin: 0;
                }

                .subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin-bottom: 16px;
                    font-weight: 400;
                }

                .input-wrapper {
                    width: 100%;
                    position: relative;
                    margin-bottom: 4px;
                }

                .input-field {
                    width: 100%;
                    padding: 14px 18px;
                    border-radius: 14px;
                    border: 2px solid #e2e8f0;
                    background: white;
                    font-family: 'Outfit', sans-serif;
                    font-size: 15px;
                    color: #1e293b;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }

                .input-field::placeholder {
                    color: #cbd5e1;
                }

                .input-field:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }

                .join-btn {
                    width: 100%;
                    padding: 14px;
                    border-radius: 14px;
                    border: none;
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    color: white;
                    font-family: 'Outfit', sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    letter-spacing: 0.2px;
                }

                .join-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.4);
                }

                .join-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .join-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .hint {
                    font-family: 'Space Mono', monospace;
                    font-size: 11px;
                    color: #cbd5e1;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .hint kbd {
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 1px 6px;
                    font-size: 10px;
                    color: #94a3b8;
                }

                .orbs {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .orb {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.4;
                }

                .orb-1 {
                    width: 8px;
                    height: 8px;
                    background: #3b82f6;
                    top: 20%;
                    left: 15%;
                    animation: drift 8s ease-in-out infinite;
                }

                .orb-2 {
                    width: 6px;
                    height: 6px;
                    background: #6366f1;
                    top: 60%;
                    right: 20%;
                    animation: drift 12s ease-in-out infinite reverse;
                }

                .orb-3 {
                    width: 10px;
                    height: 10px;
                    background: #0ea5e9;
                    bottom: 25%;
                    left: 30%;
                    animation: drift 10s ease-in-out infinite 2s;
                }

                .orb-4 {
                    width: 5px;
                    height: 5px;
                    background: #3b82f6;
                    top: 35%;
                    right: 35%;
                    animation: drift 9s ease-in-out infinite 1s;
                }

                @keyframes drift {
                    0%, 100% { transform: translate(0, 0); }
                    25% { transform: translate(20px, -15px); }
                    50% { transform: translate(-10px, 20px); }
                    75% { transform: translate(15px, 10px); }
                }
            `}</style>

            <div className="join-screen">
                <div className="grid-bg" />
                <div className="orbs">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                    <div className="orb orb-4" />
                </div>

                <div className="join-card">
                    <div className="cosmos-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    </div>

                    <h1 className="title">Virtual Cosmos</h1>
                    <p className="subtitle">Connect with anyone nearby.</p>

                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Enter your name"
                            maxLength={15}
                            className="input-field"
                        />
                    </div>

                    <button
                        onClick={handleJoin}
                        disabled={!input.trim()}
                        className="join-btn"
                    >
                        Enter Room
                    </button>

                    <div className="hint">
                        Move with <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or Arrow keys
                    </div>
                </div>
            </div>
        </>
    );
};

export default JoinScreen;