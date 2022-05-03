import { PollsTableName, ddbClient } from "../utils";

import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { nanoid } from "nanoid";

export const createPoll = async (options: string[], question: string) => {
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
    }),
    ConditionExpression: "attribute_not_exists(pollId)",
  });

  await ddbClient.send(putCommand);

  return pollId;
};
