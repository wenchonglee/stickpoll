import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { VotePollForm, VotePollSchema } from "@stickpoll/models";
import createHttpError from "http-errors";
import { broadcastVote } from "../service/broadcastVote";
import { votePoll } from "../service/votePoll";
import { withMiddleware } from "./middleware";
import { CustomLambdaHandler } from "./types";

const votePollHandler: CustomLambdaHandler<VotePollForm> = async (event) => {
  if (!event.pathParameters) {
    return { statusCode: 500, body: "Invalid body" };
  }
  const { body } = event;
  const { pollId } = event.pathParameters;

  try {
    await votePoll(pollId!, body.option, event.requestContext.identity.sourceIp);

    //! Not ideal to hold the process for broadcasting, should actually use a queue instead
    await broadcastVote(pollId!);

    return {
      statusCode: 200,
      body: "",
    };
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) {
      throw createHttpError(400, "You cannot vote more than once");
    }
    console.error(e);

    return { statusCode: 500, body: "Something went wrong" };
  }
};

module.exports = {
  handler: withMiddleware(votePollHandler, VotePollSchema),
};
