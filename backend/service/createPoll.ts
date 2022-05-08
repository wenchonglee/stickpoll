import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { PollForm } from "@stickpoll/models";
import { nanoid } from "nanoid";
import { ddbClient, PollsTableName } from "../utils";

export const createPoll = async (
  options: PollForm["options"],
  question: PollForm["question"],
  duplicationCheck: PollForm["duplicationCheck"]
) => {
  const pollId = nanoid();

  let optionsObject: Record<string, number> = {};
  options.forEach((option) => (optionsObject[option] = 0));

  const putCommand = new PutItemCommand({
    TableName: PollsTableName,
    Item: marshall({
      pollId,
      createdAt: new Date().toISOString(),
      question,
      options: optionsObject,
      voters: [],
      duplicationCheck,
    }),
    ConditionExpression: "attribute_not_exists(pollId)",
  });

  await ddbClient.send(putCommand);

  return pollId;
};
