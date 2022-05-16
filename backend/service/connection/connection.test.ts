import { createConnection, deleteConnection, getConnections, updateConnectionEnterRoom } from "./connection";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { genericError } from "../../utils/errors";

const connectionId = "CONNECTIONID";
const roomId = "ROOMID";

test("Create and delete connections", async () => {
  // Create connection and enter room
  await createConnection(connectionId);
  await updateConnectionEnterRoom(connectionId, roomId);

  let connections = await getConnections(roomId);
  expect(connections?.length).toBe(1);
  expect(connections?.[0].connectionId).toBe(connectionId);
  expect(connections?.[0].roomId).toBe(roomId);

  // Delete connection
  await deleteConnection(connectionId);
  connections = await getConnections(roomId);
  expect(connections?.length).toBe(0);
});

test("Unexpected errors should throw generic error", async () => {
  jest.spyOn(DynamoDBClient.prototype, "send").mockImplementation(() => {
    throw new Error("");
  });

  await expect(createConnection(connectionId)).rejects.toThrowError(genericError);
  await expect(updateConnectionEnterRoom(connectionId, roomId)).rejects.toThrowError(genericError);
  await expect(deleteConnection(connectionId)).rejects.toThrowError(genericError);
});

test("Falsy connection results should return null", async () => {
  jest.spyOn(DynamoDBClient.prototype, "send").mockImplementation(() => {
    return {};
  });

  const connections = await getConnections(roomId);
  expect(connections).toBeNull();
});
