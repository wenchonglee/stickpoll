module.exports = {
  tables: [
    {
      TableName: `Connections`,
      KeySchema: [{ AttributeName: "connectionId", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "connectionId", AttributeType: "S" }],
      ProvisionedThroughput: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 },
    },
    {
      TableName: `Polls`,
      KeySchema: [{ AttributeName: "pollId", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "pollId", AttributeType: "S" }],
      ProvisionedThroughput: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 },
    },
  ],
  port: 8000,
};
