import { CustomLambdaHandler, CustomMiddyHandler } from "./types";

import { ZodSchema } from "zod";
import createHttpError from "http-errors";
import httpCors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";

export const withMiddleware = <T>(handler: CustomLambdaHandler<T>, schema?: ZodSchema) => {
  const validator = schema ? [zodValidator(schema)] : [];
  const dependencies = [
    jsonBodyParser(),
    ...validator,
    httpErrorHandler(),
    httpCors({
      methods: "OPTIONS,GET,POST,PUT",
      headers: "Content-Type",
    }),
  ];

  return middy(handler).use(dependencies);
};

const zodValidator = (schema: ZodSchema) => {
  const before: CustomMiddyHandler = (request) => {
    try {
      schema.parse(request.event.body);
    } catch (e) {
      throw createHttpError(400, "Request body invalid");
    }
  };

  return {
    before,
  };
};
