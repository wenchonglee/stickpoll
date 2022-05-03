import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

export const ConnectionsTableName = "Connections";
export const PollsTableName = "Polls";
export const STICK_POLL_SALT = "STICK_POLL_SALT";

const isLocal = process.env.IS_OFFLINE;
const config: DynamoDBClientConfig = isLocal
  ? {
      // region: "localhost",
      // endpoint: "http://localhost:8000",
      // credentials: {
      //   accessKeyId: "",
      //   secretAccessKey: "",
      // },
    }
  : {};

export const websocketEndpoint = isLocal
  ? "http://localhost:3001"
  : `https://${process.env.WEBSOCKET_API}.execute-api.${process.env.AWS_REGION}.amazonaws.com/${process.env.STAGE}`;
// `https://${event.requestContext.domainName}/${event.requestContext.stage}`
export const ddbClient = new DynamoDBClient(config);
