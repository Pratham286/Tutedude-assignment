const Navbar = ({ username, onlineCount, position }) => {
    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
            style={{ backgroundColor: "rgba(7, 18, 34, 0.85)", borderBottom: "1px solid #1e3a5f" }}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: "#38bdf8", color: "#071222" }}
                >
                    {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold" style={{ color: "#ffffff" }}>
                    {username}
                </span>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-xs" style={{ color: "#94a3b8" }}>
                        {onlineCount} online
                    </span>
                </div>
                <span className="text-xs" style={{ color: "#475569" }}>
                    x: {Math.round(position.x)} y: {Math.round(position.y)}
                </span>
            </div>
        </div>
    );
};

export default Navbar;