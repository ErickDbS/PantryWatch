import { io } from "socket.io-client";

export const socket = io(`${process.env.API_BASE}`, {
  transports: ["websocket"],
  autoConnect: false,
});
