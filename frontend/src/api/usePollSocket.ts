import useWebSocket from "react-use-websocket";

const url = "wss://uuul5cihg0.execute-api.ap-southeast-1.amazonaws.com/dev";
// const url = "ws://localhost:3001";
export const usePollSocket = () => useWebSocket(url);
