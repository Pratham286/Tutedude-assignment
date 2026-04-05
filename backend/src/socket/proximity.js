import { PROXIMITY_RADIUS } from "../utils/constants.js";

export const checkProximity = (user1, user2) => {
    const dx = user1.x - user2.x;
    const dy = user1.y - user2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < PROXIMITY_RADIUS;
};

export const getRoomId = (id1, id2) => {
    return `chat_${[id1, id2].sort().join("_")}`;
};