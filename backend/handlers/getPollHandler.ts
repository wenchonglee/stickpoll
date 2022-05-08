import createHttpError, { isHttpError } from "http-errors";
import { getPoll } from "../service/getPoll";
import { withMiddleware } from "./middleware";
import { CustomLambdaHandler } from "./types";

const getPollHandler: CustomLambdaHandler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.pollId) {
    throw createHttpError(400, "Invalid path parameters");
  }

  const { pollId } = event.pathParameters;

  try {
    const data = await getPoll(pollId);

    return {
      statusCode: 200,
      body: data,
    };
  } catch (e) {
    if (isHttpError(e)) {
      throw e;
    }
    console.error(e);

    return { statusCode: 500, body: "Something went wrong" };
  }
};

module.exports = {
  handler: withMiddleware(getPollHandler),
};
