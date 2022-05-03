import { Button, Group, Loader, Radio, RadioGroup, Space } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetPoll, usePollSocket, useVotePoll } from "../api";

import { VotePollSchema } from "@stickpoll/models";
import { zodResolver } from "@hookform/resolvers/zod";

export const Poll = () => {
  let { pollId } = useParams();
  const navigate = useNavigate();

  const { mutateAsync } = useVotePoll(pollId!);
  const { sendMessage } = usePollSocket();
  const { data, isLoading } = useGetPoll(pollId!, {
    onSuccess: () => {
      sendMessage(
        JSON.stringify({
          action: "enter_room",
          roomId: pollId,
        })
      );
    },
  });

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      option: "",
    },
    resolver: zodResolver(VotePollSchema),
  });
  const { isSubmitting } = formState;

  const submitVote = handleSubmit(async (formData) => {
    await mutateAsync({ data: formData });
    navigate(`/${pollId}/results`);
  });

  if (!data) {
    return <Loader variant="bars" color="yellow" />;
  }

  return (
    <div>
      <Controller
        control={control}
        name="option"
        render={({ field }) => (
          <RadioGroup label={data.question} orientation="vertical" {...field}>
            {Object.keys(data.options).map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
          </RadioGroup>
        )}
      />

      <Space h="xl" />

      <Group>
        <Button type="submit" onClick={submitVote} loading={isSubmitting}>
          Vote
        </Button>
        <Button variant="white" component={Link} to="results">
          Results
        </Button>
        <Button
          variant="white"
          onClick={() => {
            sendMessage(
              JSON.stringify({
                action: "send_message",
                roomId: pollId,
              })
            );
          }}
          // leftIcon={<Share size={20} />}
        >
          Share
        </Button>
      </Group>
    </div>
  );
};
