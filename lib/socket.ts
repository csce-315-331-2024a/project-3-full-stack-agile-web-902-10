"use client";

import { useState, useEffect } from 'react'
import io from 'socket.io-client'

export function useSocket() {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const socketIo: any = io("ws://34.41.223.189:5000")

        setSocket(socketIo)

        function cleanup() {
            socketIo.disconnect()
        }
        return cleanup
    }, [])

    return socket
}
