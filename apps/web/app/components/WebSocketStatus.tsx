"use client";

import { useWebSocket } from "../WebSocketContext";

export function WebSocketStatus() {
  const { isConnected } = useWebSocket();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "8px 16px",
        borderRadius: "8px",
        backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
        color: isConnected ? "#155724" : "#721c24",
        border: `1px solid ${isConnected ? "#c3e6cb" : "#f5c6cb"}`,
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      {isConnected ? "🟢 WebSocket Connected" : "🔴 WebSocket Disconnected"}
    </div>
  );
}
