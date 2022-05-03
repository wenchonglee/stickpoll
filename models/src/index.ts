import { z } from "zod";

export const PollSchema = z.object({
  createdAt: z.string(),
  options: z.record(z.number()),
  pollId: z.string(),
  question: z.string(),
  totalVoteCount: z.number(),
});
export type Poll = z.infer<typeof PollSchema>;

export const PollFormSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
});
export type PollForm = z.infer<typeof PollFormSchema>;

export const VotePollSchema = z.object({
  option: z.string(),
});
export type VotePollForm = z.infer<typeof VotePollSchema>;
