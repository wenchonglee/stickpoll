import { DuplicationCheckEnum } from "@stickpoll/models";
import { createPoll } from "./createPoll";
import { getPoll } from "../getPoll";

test("Create poll", async () => {
  const question = "QUESTION";
  const options = ["OPTION1", "OPTION2"];
  const pollId = await createPoll(question, options, DuplicationCheckEnum.Enum.ip_address);

  const poll = await getPoll(pollId);
  expect(poll.pollId).toBe(pollId);
  expect(poll.question).toBe(question);
  expect(poll.options).toEqual({
    [options[0]]: 0,
    [options[1]]: 0,
  });
  expect(poll.duplicationCheck).toBe(DuplicationCheckEnum.enum.ip_address);
  expect(poll.totalVoteCount).toBe(0);
  expect(poll.createdAt).not.toBeFalsy();
});
