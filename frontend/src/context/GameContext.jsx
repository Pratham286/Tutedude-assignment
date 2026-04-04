import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { createContext } from 'react'

const GameContext = createContext();

export const GameProvider = ({children}) =>{
    const [username, setUsername] = useState("");
    const [joined, setJoined] = useState(false);

    return (
        <GameContext.Provider value={{username, setUsername, joined, setJoined}}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => useContext(GameContext);
