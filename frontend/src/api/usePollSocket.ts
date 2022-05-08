import useWebSocket from "react-use-websocket";

const url = import.meta.env.DEV
  ? "ws://localhost:3001"
  : "wss://uuul5cihg0.execute-api.ap-southeast-1.amazonaws.com/dev";
export const usePollSocket = () =>
  useWebSocket(url, {
    share: true,
  });
