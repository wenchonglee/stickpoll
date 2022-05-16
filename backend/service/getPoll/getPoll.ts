import { PollsTableName, ddbClient } from "../../utils/config";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PollSchema } from "@stickpoll/models";
import { notFoundError } from "../../utils/errors";

export const getPoll = async (pollId: string) => {
  const getCommand = new GetItemCommand({
    TableName: PollsTableName,
    Key: marshall({
      pollId,
    }),
  });

  const data = await ddbClient.send(getCommand);

  if (!data.Item) {
    throw notFoundError;
  }

  const item = unmarshall(data.Item);
  item.totalVoteCount = item.voters.length;
  delete item.voters;

  const poll = PollSchema.parse(item);

  return poll;
};
