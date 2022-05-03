import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";

import middy from "@middy/core";

export type CustomEvent<Eventbody> = Omit<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>, "body"> & {
  body: Eventbody;
};

export type CustomLambdaHandler<Eventbody = string> = Handler<CustomEvent<Eventbody>, APIGatewayProxyResult>;
export type CustomMiddyHandler = middy.MiddlewareFn<CustomEvent<Record<string, any>>, APIGatewayProxyResult>;
