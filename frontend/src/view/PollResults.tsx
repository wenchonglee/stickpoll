import { Loader, Progress, Stack } from "@mantine/core";
import { PollSchema } from "@stickpoll/models";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { QUERY_KEY_GET_POLL, useGetPoll, usePollSocket } from "../api";

export const PollResults = () => {
  let { pollId } = useParams();
  const queryClient = useQueryClient();

  const { sendMessage, lastMessage } = usePollSocket();
  useEffect(() => {
    if (lastMessage) {
      try {
        const newPollResults = PollSchema.parse(JSON.parse(lastMessage.data));
        queryClient.setQueryData(QUERY_KEY_GET_POLL, newPollResults);
      } catch (e) {
        console.warn("Something went wrong");
      }
    }
  }, [lastMessage]);

  const { data } = useGetPoll(pollId!, {
    onSuccess: () => {
      sendMessage(
        JSON.stringify({
          action: "enter_room",
          roomId: pollId,
        })
      );
    },
  });

  if (!data) {
    return <Loader variant="bars" color="yellow" />;
  }

  return (
    <Stack>
      {Object.keys(data.options).map((optionKey: any) => {
        const value = (data.options[optionKey] / data.totalVoteCount) * 100;
        return <Progress value={value} label={optionKey} size={32} key={optionKey} />;
      })}
    </Stack>
  );
};
