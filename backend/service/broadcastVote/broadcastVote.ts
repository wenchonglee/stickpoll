import {
  ApiGatewayManagementApi,
  ApiGatewayManagementApiServiceException,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { deleteConnection, getConnections } from "../connection";

import { getPoll } from "../getPoll";
import { websocketEndpoint } from "../../utils/config";

export enum Broadcast_Outcome {
  Notified,
  Deleted_Stale,
  Error_Thrown,
}

export const broadcastVote = async (targetRoomId: string) => {
  const connections = await getConnections(targetRoomId);
  if (connections === null || connections.length === 0) {
    return [];
  }

  const apigwManagementApi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: websocketEndpoint,
  });

  const poll = await getPoll(targetRoomId);

  const postCalls = connections.map(async (connection) => {
    const { connectionId } = connection;

    try {
      const postCommand = new PostToConnectionCommand({
        ConnectionId: connectionId,
        //@ts-ignore
        Data: JSON.stringify(poll),
      });

      await apigwManagementApi.send(postCommand);
      return Broadcast_Outcome.Notified;
    } catch (e) {
      if (e instanceof ApiGatewayManagementApiServiceException && e.$metadata.httpStatusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);

        await deleteConnection(connectionId);
        return Broadcast_Outcome.Deleted_Stale;
      } else {
        console.error(e);
      }
      return Broadcast_Outcome.Error_Thrown;
    }
  });

  return await Promise.all(postCalls);
};
