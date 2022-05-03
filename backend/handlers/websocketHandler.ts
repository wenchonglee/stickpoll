import {
  createConnection,
  deleteConnection,
  updateConnectionEnterRoom,
  updateConnectionExitRoom,
} from "../service/connection";

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

/**
 * Updates the connection to remove the room
 */
const exitRoom: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return { statusCode: 500, body: "Invalid request" };
  }
  const connectionId = event.requestContext.connectionId;
  const roomId = JSON.parse(event.body).data;

  await updateConnectionExitRoom(connectionId!, roomId);

  return {
    statusCode: 200,
    body: "Exited room",
  };
};

module.exports = {
  onConnect,
  onDisconnect,
  enterRoom,
  exitRoom,
};

// const sendMessage: APIGatewayProxyHandler = async (event) => {
//   if (!event.body) {
//     return { statusCode: 500, body: "Invalid request" };
//   }
//   const intendedRoomId = JSON.parse(event.body).roomId;
//   const initiatedConnectionId = event.requestContext.connectionId;

//   const connectionData = await getConnections();
//   if (!connectionData.Items) {
//     throw createHttpError(500, "Something went wrong");
//   }

//   const apigwManagementApi = new ApiGatewayManagementApi({
//     apiVersion: "2018-11-29",
//     endpoint: process.env.IS_OFFLINE
//       ? "http://localhost:3001"
//       : `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
//     // credentials: {
//     //   accessKeyId: "",
//     //   secretAccessKey: "",
//     // },
//   });

//   const postData = JSON.parse(event.body);
//   const postCalls = connectionData.Items.map(async (item: any) => {
//     const { connectionId, roomId } = unmarshall(item);
//     if (roomId !== intendedRoomId) {
//       return;
//     }

//     if (connectionId === initiatedConnectionId) {
//       return;
//     }

//     try {
//       const postCommand = new PostToConnectionCommand({
//         ConnectionId: connectionId,
//         //@ts-ignore
//         Data: "Test",
//       });

//       await apigwManagementApi.send(postCommand);
//     } catch (e) {
//       if (e.statusCode === 410) {
//         console.log(`Found stale connection, deleting ${connectionId}`);

//         const deleteCommand = new DeleteItemCommand({
//           TableName: ConnectionsTableName,
//           Key: marshall({
//             connectionId,
//           }),
//         });

//         await ddbClient.send(deleteCommand);
//       } else {
//         console.log(e);
//         // throw e;
//       }
//     }
//   });

//   try {
//     await Promise.all(postCalls);
//   } catch (e) {
//     return { statusCode: 500, body: e.stack };
//   }

//   return { statusCode: 200, body: "Data sent." };
// };
