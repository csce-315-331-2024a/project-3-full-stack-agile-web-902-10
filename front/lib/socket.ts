"use client";

import { useState, useEffect } from 'react'
import io from 'socket.io-client'

export function useSocket() {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        // localhost if local, and the server's IP if on vercel
        const ip = process.env.NODE_ENV === 'development' ? 'localhost:5000' : '34.41.223.189'
        const socketIo: any = io(ip)

        setSocket(socketIo)

        function cleanup() {
            socketIo.disconnect()
        }
        return cleanup
    }, [])

    return socket
}
