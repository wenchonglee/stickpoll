import { DuplicationCheckEnum } from "@stickpoll/models";
import { createPoll } from "../createPoll";
import { getPoll } from "../getPoll";
import { votePoll } from "./votePoll";

const question = "QUESTION";
const options = ["OPTION1", "OPTION2"];
const identity = "JOHNDOE";

test("Vote poll (IP duplicate check)", async () => {
  const pollId = await createPoll(question, options, DuplicationCheckEnum.Enum.ip_address);

  await votePoll(pollId, options[0], identity);
  const poll = await getPoll(pollId);

  expect(poll.pollId).toBe(pollId);
  expect(poll.question).toBe(question);
  expect(poll.options).toEqual({
    [options[0]]: 1,
    [options[1]]: 0,
  });
  expect(poll.duplicationCheck).toBe(DuplicationCheckEnum.enum.ip_address);
  expect(poll.totalVoteCount).toBe(1);
  expect(poll.createdAt).not.toBeFalsy();

  // A different identity can vote
  await expect(votePoll(pollId, options[1], `${identity}_2`)).resolves.toBeTruthy();

  // The same identity cannot vote again
  await expect(votePoll(pollId, options[1], identity)).rejects.toThrow();
});

test("Vote poll (No duplicate check)", async () => {
  const pollId = await createPoll(question, options, DuplicationCheckEnum.Enum.none);

  await votePoll(pollId, options[0], identity);
  const poll = await getPoll(pollId);

  expect(poll.pollId).toBe(pollId);
  expect(poll.question).toBe(question);
  expect(poll.options).toEqual({
    [options[0]]: 1,
    [options[1]]: 0,
  });
  expect(poll.duplicationCheck).toBe(DuplicationCheckEnum.enum.none);
  expect(poll.totalVoteCount).toBe(1);
  expect(poll.createdAt).not.toBeFalsy();

  // A different identity can vote
  await expect(votePoll(pollId, options[1], `${identity}_2`)).resolves.toBeTruthy();

  // The same identity can also vote again
  await expect(votePoll(pollId, options[1], identity)).resolves.toBeTruthy();
});
