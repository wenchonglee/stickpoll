// import {
//   APIGatewayEventDefaultAuthorizerContext,
//   APIGatewayProxyEventBase,
//   APIGatewayProxyHandler,
//   APIGatewayProxyResult,
//   Handler,
// } from "aws-lambda";
// import { ApiGatewayManagementApi, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
// import { ConnectionsTableName, ddbClient } from "./utils";
// import { DeleteItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
// import { PollForm, PollFormSchema } from "@stickpoll/models";
// import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

// import createHttpError from "http-errors";
// import { createPoll } from "./service/createPoll";
// import { getPoll } from "./service/getPoll";
// import jsonBodyParser from "@middy/http-json-body-parser";
// import middy from "@middy/core";
// import { votePoll } from "./service/votePoll";

// /**
//  * TODO;
//  * - Write tests
//  */

// type CustomLambdaHandler<Eventbody> = Handler<
//   Omit<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>, "body"> & { body: Eventbody },
//   APIGatewayProxyResult
// >;

// const createPollHandler2: CustomLambdaHandler<PollForm> = async (event) => {
//   const body = event.body;

//   try {
//     const pollId = await createPoll(body.options, body.question);
//     return {
//       statusCode: 201,
//       body: JSON.stringify({ pollId }),
//     };
//   } catch (e) {
//     console.log(e);

//     return {
//       statusCode: 500,
//       body: JSON.stringify(e),
//     };
//   }
// };

// const customValidate = {
//   before: async (request: any) => {
//     try {
//       PollFormSchema.parse(request.event.body);
//     } catch (e) {
//       throw createHttpError(400, "This is a nono");
//     }
//   },
// };

// const createPollHandler = middy(createPollHandler2).use(jsonBodyParser()).use(customValidate);

// const getPollHandler: APIGatewayProxyHandler = async (event) => {
//   if (!event.pathParameters) {
//     return { statusCode: 500, body: "Invalid body" };
//   }
//   const { pollId } = event.pathParameters;

//   try {
//     const data = await getPoll(pollId!);

//     return {
//       statusCode: 200,
//       body: data,
//     };
//   } catch (e) {
//     console.log(e);
//     return { statusCode: 500, body: e.stack };
//   }
// };

// const votePollHandler: APIGatewayProxyHandler = async (event) => {
//   if (!event.pathParameters || !event.body) {
//     return { statusCode: 500, body: "Invalid body" };
//   }

//   const body: {
//     option: string;
//   } = JSON.parse(event.body);
//   const { pollId } = event.pathParameters;

//   try {
//     await votePoll(pollId!, body.option, event.requestContext.identity.sourceIp);
//     return {
//       statusCode: 200,
//       body: JSON.stringify({}),
//     };
//   } catch (e) {
//     console.log(e);
//     return { statusCode: 500, body: e.stack };
//   }
// };

// const onConnect: APIGatewayProxyHandler = async (event) => {
//   const connectionId = event.requestContext.connectionId;

//   const putCommand = new PutItemCommand({
//     TableName: ConnectionsTableName,
//     Item: marshall({
//       connectionId,
//     }),
//   });

//   try {
//     await ddbClient.send(putCommand);
//   } catch (error) {
//     console.log(error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify(error),
//     };
//   }

//   return {
//     statusCode: 200,
//     body: "test!",
//   };
// };

// const onDisconnect: APIGatewayProxyHandler = async (event) => {
//   const connectionId = event.requestContext.connectionId;
//   const deleteCommand = new DeleteItemCommand({
//     TableName: ConnectionsTableName,
//     Key: marshall({
//       connectionId,
//     }),
//   });

//   try {
//     await ddbClient.send(deleteCommand);
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify(error),
//     };
//   }
//   return {
//     statusCode: 200,
//     body: "",
//   };
// };

// const sendMessage: APIGatewayProxyHandler = async (event) => {
//   if (!event.body) {
//     return { statusCode: 500, body: "no body" };
//   }
//   const intendedRoomId = JSON.parse(event.body).roomId;
//   const initiatedConnectionId = event.requestContext.connectionId;

//   let connectionData: any;
//   const scanCommand = new ScanCommand({
//     TableName: ConnectionsTableName,
//     ProjectionExpression: "connectionId,roomId",
//   });

//   try {
//     connectionData = await ddbClient.send(scanCommand);
//   } catch (e) {
//     return { statusCode: 500, body: e.stack };
//   }

//   const endpoint = process.env.IS_OFFLINE ? "http://localhost:3001" : process.env.PUBLISH_ENDPOINT;
//   const apigwManagementApi = new ApiGatewayManagementApi({
//     apiVersion: "2018-11-29",
//     endpoint: endpoint,
//     credentials: {
//       accessKeyId: "",
//       secretAccessKey: "",
//     },
//     // endpoint: event.requestContext.domainName + "/" + event.requestContext.stage,
//   });

//   const postData = JSON.parse(event.body as any).data;

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
//         Data: postData,
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
//         throw e;
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

// const enterRoom: APIGatewayProxyHandler = async (event) => {
//   if (!event.body) {
//     return { statusCode: 500, body: "no body" };
//   }
//   const connectionId = event.requestContext.connectionId;
//   const { roomId } = JSON.parse(event.body);

//   const putCommand = new PutItemCommand({
//     TableName: ConnectionsTableName,
//     Item: marshall({
//       connectionId,
//       roomId,
//     }),
//   });

//   try {
//     await ddbClient.send(putCommand);
//   } catch (error) {
//     console.log(error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify(error),
//     };
//   }

//   return {
//     statusCode: 200,
//     body: "test!",
//   };
// };

// const exitRoom: APIGatewayProxyHandler = async (event) => {
//   if (!event.body) {
//     return { statusCode: 500, body: "no body" };
//   }

//   const connectionId = event.requestContext.connectionId;
//   const roomId = JSON.parse(event.body).data;
//   const deleteCommand = new DeleteItemCommand({
//     TableName: ConnectionsTableName,
//     Key: marshall({
//       connectionId,
//       roomId,
//     }),
//   });

//   try {
//     await ddbClient.send(deleteCommand);
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify(error),
//     };
//   }
//   return {
//     statusCode: 200,
//     body: "",
//   };
// };
export const abc = "";
// module.exports = {
//   onConnect,
//   onDisconnect,
//   sendMessage,
//   createPollHandler,
//   getPollHandler,
//   enterRoom,
//   exitRoom,
//   votePollHandler,
// };

// // const updateCommand = new UpdateItemCommand({
// //   TableName: PollsTableName,
// //   Key: marshall({
// //     pollId,
// //   }),
// //   ExpressionAttributeNames: {
// //     "#options": `options`,
// //     "#optionName": `${body.option}`,
// //   },
// //   ExpressionAttributeValues: {
// //     ":voters": {
// //       L: [{ S: hashedIP }],
// //     },
// //     ":voter": {
// //       S: hashedIP,
// //     },
// //   },
// //   ConditionExpression: `not(contains(#options.#optionName, :voter))`,
// //   UpdateExpression: "SET #options.#optionName = list_append(#options.#optionName, :voters)",
// //   ReturnValues: "ALL_NEW",
// // });
