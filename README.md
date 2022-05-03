# Stickpoll

A full stack webapp that clones strawpoll and other poll webapps

## Tech Stack

Organized using yarn workspaces

### Backend

- Serverless
- AWS Lambda (Node14)
  - Middy
  - Webpack
- AWS DynamoDB

### Frontend

- AWS Cloudfront (deployment)
- Reactjs
  - Vite
  - Mantine
  - React-query
  - React-router-dom

## Local Setup

To run this locally, you'll need to install:

- [Serverless](https://www.serverless.com/)
- [Dynamodb (for local instance)](https://www.serverless.com/plugins/serverless-dynamodb-local)  
  `sls dynamodb install`

### Running locally

**Serverless backend**  
`yarn start`, or `sls offline start`

**Local frontend**  
`cd frontend && yarn start`

## Deploying

**Build frontend**

- `cd frontend && yarn build`

**Build & deploy backend+frontend**

- `sls deploy`
