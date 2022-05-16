import createHttpError from "http-errors";

export const genericError = createHttpError(500, "Something went wrong");
export const notFoundError = createHttpError(404, "Not found");
