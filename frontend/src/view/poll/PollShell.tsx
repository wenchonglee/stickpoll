import { Box, Group, Loader, Space, Stack, Text, Title } from "@mantine/core";
import { useRef } from "react";
import { Helmet } from "react-helmet";
import { Outlet, useMatch, useParams } from "react-router-dom";
import { useGetPoll, usePollSocket } from "../../api";
import { ShareButton } from "../../component/ShareButton";
import { dayjs } from "../../utils";

export const PollShell = () => {
  let { pollId } = useParams();
  const pathMatch = useMatch("/:pollId/results");
  const isResultsPage = !!pathMatch;

  const { sendMessage } = usePollSocket();

  const fetchCountRef = useRef<number>(0);
  const { data } = useGetPoll(pollId!, {
    onSuccess: () => {
      if (fetchCountRef.current === 0) {
        sendMessage(
          JSON.stringify({
            action: "enter_room",
            roomId: pollId,
          })
        );
      }

      fetchCountRef.current = 1;
    },
  });

  if (!data) {
    return <Loader variant="bars" color="yellow" />;
  }

  return (
    <Box>
      <Helmet>
        <meta name="description" content={data.question} />
      </Helmet>

      <Title order={2}>{data.question}</Title>
      <Group align="flex-end" sx={{ gap: "0px" }}>
        <Text size="xs" color="dimmed">
          Created {dayjs(data.createdAt).fromNow()}
        </Text>

        {isResultsPage && (
          <Text size="xs" color="yellow">
            &nbsp;· {isResultsPage ? "Streaming votes in live" : ""}
          </Text>
        )}
      </Group>

      <Space h="lg" />
      <Outlet context={{ data }} />
      <Space h="xl" />

      <Stack>
        <ShareButton />
      </Stack>
    </Box>
  );
};
