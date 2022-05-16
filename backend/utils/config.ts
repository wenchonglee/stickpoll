import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

export const ConnectionsTableName = "Connections";
export const PollsTableName = "Polls";
export const STICK_POLL_SALT = "STICK_POLL_SALT";

const isTest = process.env.JEST_WORKER_ID;
const isLocal = process.env.IS_OFFLINE;
const config: DynamoDBClientConfig = isTest
  ? {
      endpoint: "http://localhost:8000",
      region: "ap-southeast-1",
      tls: false,
      credentials: {
        accessKeyId: "foo",
        secretAccessKey: "bar",
      },
    }
  : {};

export const websocketEndpoint = isLocal
  ? "http://localhost:3001"
  : `https://${process.env.WEBSOCKET_API}.execute-api.${process.env.AWS_REGION}.amazonaws.com/${process.env.STAGE}`;

export const ddbClient = new DynamoDBClient(config);
