import { ConnectionsTableName, ddbClient } from "../utils";
import { DeleteItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

import createHttpError from "http-errors";
import { marshall } from "@aws-sdk/util-dynamodb";

export const createConnection = async (connectionId: string) => {
  const putCommand = new PutItemCommand({
    TableName: ConnectionsTableName,
    Item: marshall({
      connectionId,
    }),
  });

  try {
    await ddbClient.send(putCommand);
  } catch (e) {
    console.error(e);

    throw createHttpError(500, "Something went wrong");
  }
};

export const deleteConnection = async (connectionId: string) => {
  const deleteCommand = new DeleteItemCommand({
    TableName: ConnectionsTableName,
    Key: marshall({
      connectionId,
    }),
  });

  try {
    await ddbClient.send(deleteCommand);
  } catch (e) {
    console.error(e);

    throw createHttpError(500, "Something went wrong");
  }
};

export const updateConnectionEnterRoom = async (connectionId: string, roomId: string) => {
  const putCommand = new PutItemCommand({
    TableName: ConnectionsTableName,
    Item: marshall({
      connectionId,
      roomId,
    }),
  });

  try {
    await ddbClient.send(putCommand);
  } catch (e) {
    console.error(e);
    throw createHttpError(500, "Something went wrong");
  }
};

export const updateConnectionExitRoom = async (connectionId: string, roomId: string) => {
  const deleteCommand = new DeleteItemCommand({
    TableName: ConnectionsTableName,
    Key: marshall({
      connectionId,
      roomId,
    }),
  });

  try {
    await ddbClient.send(deleteCommand);
  } catch (e) {
    console.error(e);
    throw createHttpError(500, "Something went wrong");
  }
};

export const getConnections = async (roomId: string) => {
  const scanCommand = new ScanCommand({
    TableName: ConnectionsTableName,
    ProjectionExpression: "connectionId,roomId",
    FilterExpression: "roomId = :rId",
    ExpressionAttributeValues: {
      ":rId": {
        S: roomId,
      },
    },
  });

  try {
    const connections = await ddbClient.send(scanCommand);

    return connections;
  } catch (e) {
    console.error(e);
  }
};
