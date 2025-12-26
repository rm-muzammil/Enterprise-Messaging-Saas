import Chat from "@/components/Chat";

export default function ChatPage() {
  const conversationId = "room-1"; // For now, simple test room
  const userId = "user-123"; // Temporary test user

  return (
    <div>
      <h1>Enterprise Messaging - Phase 2 Test</h1>
      <Chat conversationId={conversationId} userId={userId} />
    </div>
  );
}
