/**
 * The socket.io server instance.
 * @remarks
 * This server instance is used to handle real-time communication between the client and the server.
 */
import { Server } from "socket.io";

export const io = new Server({
    cors: {
        origin: "*",
    },
});