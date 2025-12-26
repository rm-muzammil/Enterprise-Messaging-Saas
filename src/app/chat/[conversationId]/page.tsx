"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket-client";

export default function Chat({
  params,
}: {
  params: { conversationId: string };
}) {
  const socket = getSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join-conversation", params.conversationId);

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  function sendMessage() {
    const message = {
      conversationId: params.conversationId,
      content: text,
    };

    socket.emit("send-message", message);
    setMessages((prev) => [...prev, message]);
    setText("");
  }

  return (
    <div className="p-4">
      <div className="h-80 overflow-y-auto border">
        {messages.map((m, i) => (
          <div key={i} className="p-2">
            {m.content}
          </div>
        ))}
      </div>

      <div className="flex mt-2">
        <input
          className="border flex-1 p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}
