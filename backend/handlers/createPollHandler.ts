import { PollForm, PollFormSchema } from "@stickpoll/models";

import { CustomLambdaHandler } from "./types";
import { createPoll } from "../service/createPoll";
import { withMiddleware } from "./middleware";

const createPollHandler: CustomLambdaHandler<PollForm> = async (event) => {
  const { body } = event;

  try {
    const pollId = await createPoll(body.options, body.question);

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
