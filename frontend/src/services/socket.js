let socket;
let reconnectTimeout;

export const disconnectSocket = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (socket) {
    socket.onclose = null;
    socket.close();
    socket = null;
  }
};

export const connectSocket = (roomId, onMessage) => {
  disconnectSocket();
  
  // Use current host for WebSocket to support dev server and remote access
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsHost = import.meta.env.VITE_WS_HOST || "localhost:8000";
  
  const wsUrl = roomId === "matchmaking" 
    ? `${wsProtocol}://${wsHost}/ws/matchmaking/`
    : `${wsProtocol}://${wsHost}/ws/game/${roomId}/`;
  
  socket = new WebSocket(wsUrl);

  socket.onopen = () => console.log("WebSocket connected");

  socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        onMessage(data);
    } catch (e) {
        console.error("Invalid websocket message:", e);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected... retrying in 2s");
    reconnectTimeout = setTimeout(() => connectSocket(roomId, onMessage), 2000);
  };
  
  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
};

export const sendMessage = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn("WebSocket not open. Message not sent.");
  }
};
