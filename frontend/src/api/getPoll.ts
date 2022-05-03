import { Poll, PollSchema } from "@stickpoll/models";
import { UseQueryOptions, useQuery } from "react-query";

import { Axios } from "./axiosConfig";

export const QUERY_KEY_GET_POLL = "get_poll";

export const useGetPoll = (
  pollId: string,
  useQueryOptions: UseQueryOptions<unknown, unknown, Poll, typeof QUERY_KEY_GET_POLL>
) => {
  const getPoll = async (): Promise<Poll> => {
    const response = await Axios.get(`/poll/${pollId}`);
    const poll = PollSchema.parse(response.data);

    return poll;
  };

  return useQuery(QUERY_KEY_GET_POLL, getPoll, useQueryOptions);
};
