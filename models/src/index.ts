import { z } from "zod";

export const DuplicationCheckEnum = z.enum(["none", "ip_address"]);

export const PollSchema = z.object({
  createdAt: z.string(),
  options: z.record(z.number()),
  pollId: z.string(),
  question: z.string().min(1),
  totalVoteCount: z.number(),
  duplicationCheck: DuplicationCheckEnum,
});
export type Poll = z.infer<typeof PollSchema>;

export const PollFormSchema = z.object({
  question: z.string().min(1, { message: "Question cannot be empty" }),
  options: z.array(z.string()),
  duplicationCheck: DuplicationCheckEnum,
});
export type PollForm = z.infer<typeof PollFormSchema>;

export const VotePollSchema = z.object({
  option: z.string().min(1, { message: "You must pick an option to vote" }),
});
export type VotePollForm = z.infer<typeof VotePollSchema>;
