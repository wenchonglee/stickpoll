import { PollsTableName, ddbClient } from "../../utils/config";

import { PollForm } from "@stickpoll/models";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { nanoid } from "nanoid";

export const createPoll = async (
  question: PollForm["question"],
  options: PollForm["options"],
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
