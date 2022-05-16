import { getPoll } from "./getPoll";
import { notFoundError } from "../../utils/errors";

test("Throw 404 if poll does not exist", async () => {
  await expect(getPoll("POLLID")).rejects.toThrowError(notFoundError);
});
