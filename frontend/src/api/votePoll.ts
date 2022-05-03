import { VotePollForm, VotePollSchema } from "@stickpoll/models";

import { Axios } from "./axiosConfig";
import { useMutation } from "react-query";

export const useVotePoll = (pollId: string) => {
  const postVotePoll = async (params: { data: VotePollForm }) => {
    const { data } = params;
    VotePollSchema.parse(data);
    const response = await Axios.post(`/poll/${pollId}/vote`, data);

    return response.data;
  };

  return useMutation(postVotePoll);
};
