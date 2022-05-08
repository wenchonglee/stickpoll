import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, Loader, Radio, RadioGroup, Space, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { VotePollSchema } from "@stickpoll/models";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetPoll, usePollSocket, useVotePoll } from "../api";

export const VotePollForm = () => {
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
  const { errors, isSubmitting } = formState;

  const submitVote = handleSubmit(async (formData) => {
    await mutateAsync(
      { data: formData },
      {
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            showNotification({
              title: "Something went wrong",
              message: error.response?.data,
              color: "red",
            });
          }
        },
      }
    );
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
          <RadioGroup label={<h2>{data.question}</h2>} orientation="vertical" error={errors.option?.message} {...field}>
            {Object.keys(data.options).map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
          </RadioGroup>
        )}
      />

      <Space h="xl" />

      <Stack>
        <Group>
          <Button type="submit" onClick={submitVote} loading={isSubmitting}>
            Vote
          </Button>

          <Button variant="default" component={Link} to="results">
            View Results
          </Button>
        </Group>
        <ShareButton />
      </Stack>
    </div>
  );
};

const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  return (
    <Input
      sx={{
        maxWidth: "400px",
      }}
      readOnly
      rightSection={
        <Button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
          }}
          compact
          color="teal"
          variant="outline"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      }
      value={window.location.href}
      rightSectionWidth={100}
    />
  );
};
