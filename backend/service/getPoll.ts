import { PollsTableName, ddbClient } from "../utils";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import createHttpError from "http-errors";

export const getPoll = async (pollId: string) => {
  const getCommand = new GetItemCommand({
    TableName: PollsTableName,
    Key: marshall({
      pollId,
    }),
  });

  const data = await ddbClient.send(getCommand);

  if (!data.Item) {
    throw createHttpError(404, "Not found");
  }

  const item = unmarshall(data.Item);
  item.totalVoteCount = item.voters.length;
  delete item.voters;

  return JSON.stringify(item);
};
