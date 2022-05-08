import { PollForm, PollFormSchema } from "@stickpoll/models";
import { createPoll } from "../service/createPoll";
import { withMiddleware } from "./middleware";
import { CustomLambdaHandler } from "./types";

const createPollHandler: CustomLambdaHandler<PollForm> = async (event) => {
  const { body } = event;

  try {
    const pollId = await createPoll(body.options, body.question, body.duplicationCheck);

    return {
      statusCode: 201,
      body: JSON.stringify({ pollId }),
    };
  } catch (e) {
    console.error(e);

    return { statusCode: 500, body: "Something went wrong" };
  }
};

module.exports = {
  handler: withMiddleware(createPollHandler, PollFormSchema),
};
