import { Box, Button, Input, InputWrapper, Stack, Textarea } from "@mantine/core";
import { useFieldArray, useForm } from "react-hook-form";

import { PollFormSchema } from "@stickpoll/models";
import { useCreatePoll } from "../api";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Because useFieldArray only support array of objects, we have to alter the schema here
const RhfPollForm = PollFormSchema.extend({
  options: z.array(
    z.object({
      value: z.string(),
    })
  ),
});

export const CreatePollForm = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useCreatePoll();
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      question: "",
      options: [
        {
          value: "",
        },
        {
          value: "",
        },
      ],
    },
    resolver: zodResolver(RhfPollForm),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const handleCreatePoll = handleSubmit(async (formData) => {
    const stringArrayOptions = formData.options.map((option) => option.value);

    const pollData = await mutateAsync({
      data: {
        question: formData.question,
        options: stringArrayOptions,
      },
    });
    const { pollId } = pollData;
    navigate(`/${pollId}`);
  });

  return (
    <Stack>
      <Textarea
        required
        label="Ask a question"
        placeholder="E.g. Where should we get dinner?"
        {...register("question")}
      />

      <InputWrapper
        required
        label="Poll Options"
        sx={{
          position: "relative",
          "& .mantine-InputWrapper-description": {
            top: "0px",
            right: "0px",
            position: "absolute",
          },
        }}
        description={
          <Button onClick={() => append({ value: "" })} compact variant="light">
            Add option
          </Button>
        }
      >
        <Stack>
          {fields.map((field, index) => (
            <Input
              key={field.id}
              placeholder={`Option ${index + 1}`}
              rightSection={
                index > 1 ? (
                  <Button onClick={() => remove(index)} compact color="yellow" variant="outline">
                    Remove
                  </Button>
                ) : undefined
              }
              rightSectionWidth={100}
              {...register(`options.${index}.value`)}
            />
          ))}
        </Stack>
      </InputWrapper>

      <Box>
        <Button type="submit" onClick={handleCreatePoll}>
          Create poll
        </Button>
      </Box>
    </Stack>
  );
};
