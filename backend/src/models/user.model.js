import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
        default: null,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastPosition: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
    },
    lastSeen: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);