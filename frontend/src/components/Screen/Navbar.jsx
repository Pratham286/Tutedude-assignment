const Navbar = ({ username, onlineCount, position, onLeave }) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-gray-800/90 border-b border-gray-700 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={onLeave}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-red-500/20 hover:bg-red-500 transition text-red-400 hover:text-white font-bold"
                    title="Leave Cosmos"
                >
                    ←
                </button>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500 text-white">
                    {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-white">
                    {username}
                </span>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 bg-green-500/15 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs font-semibold text-green-400">
                        {onlineCount} online
                    </span>
                </div>
                <div className="bg-gray-700 px-3 py-1 rounded-full">
                    <span className="text-xs font-mono font-semibold text-blue-400">
                        x: {Math.round(position.x)}  y: {Math.round(position.y)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;