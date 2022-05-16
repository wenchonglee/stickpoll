import { ConnectionsTableName, ddbClient } from "../../utils/config";
import { DeleteItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { ConnectionSchema } from "../../utils/model";
import { genericError } from "../../utils/errors";

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

    throw genericError;
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

    throw genericError;
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

    throw genericError;
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

    if (!connections?.Items) {
      return null;
    }

    return connections.Items.map((item) => ConnectionSchema.parse(unmarshall(item)));
  } catch (e) {
    console.error(e);
    return null;
  }
};
