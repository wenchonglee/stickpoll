import { createConnection, deleteConnection, updateConnectionEnterRoom } from "../service/connection";

import { APIGatewayProxyHandler } from "aws-lambda";

/**
 * Initiate websocket connection by creating a Connection db entry
 */
const onConnect: APIGatewayProxyHandler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  await createConnection(connectionId!);

  return {
    statusCode: 200,
    body: "Connected",
  };
};

/**
 * Disconnect the websocket connection by deleting the Connection db entry
 */
const onDisconnect: APIGatewayProxyHandler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  await deleteConnection(connectionId!);

  return {
    statusCode: 200,
    body: "Disconnected",
  };
};

/**
 * Updates the connection with a specific room (i.e. poll)
 */
const enterRoom: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return { statusCode: 500, body: "Invalid request" };
  }
  const connectionId = event.requestContext.connectionId;
  const { roomId } = JSON.parse(event.body);

  await updateConnectionEnterRoom(connectionId!, roomId);

  return {
    statusCode: 200,
    body: "Entered room",
  };
};
module.exports = {
  onConnect,
  onDisconnect,
  enterRoom,
};
