import { PollsTableName, STICK_POLL_SALT, ddbClient } from "../utils";

import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { createHmac } from "crypto";
import { marshall } from "@aws-sdk/util-dynamodb";

export const votePoll = async (pollId: string, option: string, identity: string) => {
  const hashedIP = createHmac("md5", STICK_POLL_SALT).update(identity).digest("hex");
  const updateCommand = new UpdateItemCommand({
    TableName: PollsTableName,
    Key: marshall({
      pollId,
    }),
    ExpressionAttributeNames: {
      "#options": `options`,
      "#optionName": option,
      "#voters": "voters",
    },
    ExpressionAttributeValues: {
      ":voters": {
        L: [{ S: hashedIP }],
      },
      // ":voter": {
      //   S: hashedIP,
      // },
      ":inc": {
        N: "1",
      },
    },
    // ConditionExpression: `not(contains(#voters, :voter))`,
    UpdateExpression: "SET #voters = list_append(#voters, :voters) ADD #options.#optionName :inc",
    ReturnValues: "ALL_NEW",
  });

  return await ddbClient.send(updateCommand);
};
