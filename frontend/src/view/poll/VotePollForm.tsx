import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, Radio, RadioGroup, Space, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Poll, VotePollSchema } from "@stickpoll/models";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useVotePoll } from "../../api";

export const VotePollForm = () => {
  let { pollId } = useParams();
  const navigate = useNavigate();
  const { data } = useOutletContext<{ data: Poll }>();

  const { mutateAsync } = useVotePoll(pollId!);

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

  return (
    <Box>
      <Controller
        control={control}
        name="option"
        render={({ field }) => (
          <RadioGroup orientation="vertical" error={errors.option?.message} {...field}>
            {Object.keys(data.options).map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
          </RadioGroup>
        )}
      />

      <Space h="xl" />
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
      </Stack>
    </Box>
  );
};
