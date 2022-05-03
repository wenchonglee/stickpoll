import {
  ApiGatewayManagementApi,
  ApiGatewayManagementApiServiceException,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { ConnectionsTableName, ddbClient, websocketEndpoint } from "../utils";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { ConnectionSchema } from "../model";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { getConnections } from "./connection";
import { getPoll } from "./getPoll";

export const broadcastVote = async (targetRoomId: string, targetConnectionId: string) => {
  const connectionData = await getConnections(targetRoomId);
  if (!connectionData?.Items) {
    return;
  }

  const apigwManagementApi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: websocketEndpoint,
  });

  const poll = await getPoll(targetRoomId);

  const postCalls = connectionData.Items.map(async (item) => {
    const { connectionId } = ConnectionSchema.parse(unmarshall(item));
    if (connectionId === targetConnectionId) {
      return;
    }

    try {
      const postCommand = new PostToConnectionCommand({
        ConnectionId: connectionId,
        //@ts-ignore
        Data: poll,
      });

      await apigwManagementApi.send(postCommand);
    } catch (e) {
      if (e instanceof ApiGatewayManagementApiServiceException && e.$metadata.httpStatusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        const deleteCommand = new DeleteItemCommand({
          TableName: ConnectionsTableName,
          Key: marshall({
            connectionId,
          }),
        });

        await ddbClient.send(deleteCommand);
      } else {
        console.error(e);
      }
    }
  });

  await Promise.all(postCalls);
};
