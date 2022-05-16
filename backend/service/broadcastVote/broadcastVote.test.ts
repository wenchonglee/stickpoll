import {
  ApiGatewayManagementApi,
  ApiGatewayManagementApiServiceException,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { Broadcast_Outcome, broadcastVote } from "./broadcastVote";
import { createConnection, getConnections, updateConnectionEnterRoom } from "../connection";

import { DuplicationCheckEnum } from "@stickpoll/models";
import { createPoll } from "../createPoll";

const question = "QUESTION";
const options = ["OPTION1", "OPTION2"];
const connectionId = "CONNECTIONID";
const roomId = "ROOMID";

test("Broadcast ends if there are no connections", async () => {
  // Prepare a poll without any connections
  const pollId = await createPoll(question, options, DuplicationCheckEnum.Enum.ip_address);
  const broadcastOutcome = await broadcastVote(pollId);

  expect(broadcastOutcome.length).toBe(0);
});

test("Broadcast throws if poll does not exist", async () => {
  // Prepare 1 client connection without a poll
  await createConnection(connectionId);
  await updateConnectionEnterRoom(connectionId, roomId);

  await expect(broadcastVote(roomId)).rejects.toThrowError("Not found");
});

test("Broadcast is sent to all connections", async () => {
  jest.spyOn(ApiGatewayManagementApi.prototype, "send").mockImplementation(() => {});

  // Prepare poll and 1 client connection
  const pollId = await createPoll(question, options, DuplicationCheckEnum.Enum.ip_address);
  await createConnection(connectionId);
  await updateConnectionEnterRoom(connectionId, pollId);

  const broadcastOutcome = await broadcastVote(pollId);
  expect(broadcastOutcome.length).toBe(1);
  expect(broadcastOutcome[0]).toBe(Broadcast_Outcome.Notified);
});

test("Broadcast deletes stale connections", async () => {
  jest.spyOn(ApiGatewayManagementApi.prototype, "send").mockImplementation(() => {
    throw new ApiGatewayManagementApiServiceException({
      name: "mock",
      $fault: "client",
      $metadata: {
        httpStatusCode: 410,
      },
    });
  });

  // Prepare poll and 1 client connection
  const pollId = await createPoll(question, options, DuplicationCheckEnum.Enum.ip_address);
  await createConnection(connectionId);
  await updateConnectionEnterRoom(connectionId, pollId);

  const broadcastOutcome = await broadcastVote(pollId);

  expect(broadcastOutcome.length).toBe(1);
  expect(broadcastOutcome[0]).toBe(Broadcast_Outcome.Deleted_Stale);
  const connections = await getConnections(pollId);
  expect(connections?.length).toBe(0);
});
