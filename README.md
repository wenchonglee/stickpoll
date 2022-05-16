# [Stickpoll](https://d2ysacn0svi6t1.cloudfront.net/)

![CI](https://github.com/wenchonglee/stickpoll/actions/workflows/ci.yml/badge.svg)

A full stack webapp clone of strawpoll

## Tech Stack

Organized using yarn workspaces

### Backend

- Serverless
- AWS Lambda (Node14)
  - [Middy](https://github.com/middyjs/middy)
  - Webpack
- AWS DynamoDB

Websocket uses [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html)

### Frontend

- AWS Cloudfront (deployment)
- Reactjs
  - [Vite](https://github.com/vitejs/vite)
  - [Mantine](https://github.com/mantinedev/mantine/)
  - [React-query](https://github.com/tannerlinsley/react-query)

### Models

- [Zod](https://github.com/colinhacks/zod)

## Local Setup

To run this locally, you'll need to install:

- [Serverless](https://www.serverless.com/)
- [Dynamodb (for local instance)](https://www.serverless.com/plugins/serverless-dynamodb-local)  
  `sls dynamodb install`

### Running locally

**Serverless backend**  
`yarn start`, or `sls offline start`

**Local frontend**  
`yarn workspace frontend start`

## Deploying

**Build frontend**

- `yarn workspace frontend build`

**Build & deploy backend+frontend**

- `sls deploy`
- `aws cloudfront create-invalidation --distribution-id {distributionID} --paths "/*"`
