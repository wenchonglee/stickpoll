import { PollForm, PollFormSchema } from "@stickpoll/models";

import { Axios } from "./axiosConfig";
import { useMutation } from "react-query";

export const useCreatePoll = () => {
  const postPoll = async (params: { data: PollForm }) => {
    const { data } = params;
    PollFormSchema.parse(data);
    const response = await Axios.post("/poll", data);

    return response.data;
  };

  return useMutation(postPoll);
};
