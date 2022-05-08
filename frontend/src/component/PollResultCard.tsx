import { Box, Group, Progress, Text } from "@mantine/core";

export const PollResultCard = ({
  label,
  voteCount,
  totalVoteCount,
}: {
  label: string;
  voteCount: number;
  totalVoteCount: number;
}) => {
  const value = totalVoteCount !== 0 ? (voteCount / totalVoteCount) * 100 : 0;

  return (
    <Box>
      <Group position="apart" noWrap align="flex-end">
        <Text>{label}</Text>
        <Text
          color="dimmed"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          {voteCount > 1 ? `${voteCount} votes` : `${voteCount} vote`} · {value.toFixed(2)}%
        </Text>
      </Group>
      <Progress value={value} size={32} />
    </Box>
  );
};
