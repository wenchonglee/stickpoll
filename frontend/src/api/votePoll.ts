import { VotePollForm, VotePollSchema } from "@stickpoll/models";
import { useMutation, useQueryClient } from "react-query";
import { Axios } from "./axiosConfig";
import { QUERY_KEY_GET_POLL } from "./getPoll";

export const useVotePoll = (pollId: string) => {
  const queryClient = useQueryClient();
  const postVotePoll = async (params: { data: VotePollForm }) => {
    const { data } = params;
    VotePollSchema.parse(data);
    const response = await Axios.post(`/poll/${pollId}/vote`, data);

    return response.data;
  };

  return useMutation(postVotePoll, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY_GET_POLL, pollId]);
    },
  });
};
