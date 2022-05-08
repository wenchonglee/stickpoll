import { Box, Button, Space, Stack } from "@mantine/core";
import { Poll, PollSchema } from "@stickpoll/models";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Link, useOutletContext } from "react-router-dom";
import { QUERY_KEY_GET_POLL, usePollSocket } from "../../api";
import { PollResultCard } from "../../component/PollResultCard";

export const PollResults = () => {
  const queryClient = useQueryClient();
  const { data } = useOutletContext<{ data: Poll }>();

  const { lastMessage } = usePollSocket();
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

  return (
    <Stack>
      {Object.keys(data.options).map((optionKey) => {
        return (
          <PollResultCard
            key={optionKey}
            label={optionKey}
            voteCount={data.options[optionKey]}
            totalVoteCount={data.totalVoteCount}
          />
        );
      })}

      <Space h="sm" />

      <Box>
        <Button variant="default" component={Link} to="..">
          Return to vote page
        </Button>
      </Box>
    </Stack>
  );
};
