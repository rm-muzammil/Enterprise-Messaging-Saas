"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

interface Message {
  senderId: string;
  message: string;
  conversationId: string;
}

export default function Chat({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!socket) socket = io("http://localhost:3000");

    socket.emit("join-room", conversationId);

    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const msg: Message = { senderId: userId, message: newMsg, conversationId };
    setMessages((prev) => [...prev, msg]);
    socket.emit("send-message", msg);
    setNewMsg("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, width: 400 }}>
      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{ textAlign: m.senderId === userId ? "right" : "left" }}
          >
            <strong>{m.senderId === userId ? "You" : m.senderId}</strong>:{" "}
            {m.message}
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 5 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 5 }}>
          Send
        </button>
      </div>
    </div>
  );
}
