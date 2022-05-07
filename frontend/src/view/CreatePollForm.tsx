import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Input, InputWrapper, Stack, Textarea } from "@mantine/core";
import { PollFormSchema } from "@stickpoll/models";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCreatePoll } from "../api";

// Because useFieldArray only support array of objects, we have to alter the schema here
const RhfPollForm = PollFormSchema.extend({
  options: z.array(
    z.object({
      value: z.string().min(1, { message: "Option cannot be empty" }),
    })
  ),
});

export const CreatePollForm = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useCreatePoll();
  const { register, control, handleSubmit, formState } = useForm({
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
  const { errors, isSubmitting } = formState;

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
        error={errors.question?.message}
        disabled={isSubmitting}
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
        error={errors.options ? "There must be at least 2 non-empty options" : undefined}
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
              disabled={isSubmitting}
              {...register(`options.${index}.value`)}
            />
          ))}
        </Stack>
      </InputWrapper>

      <Box>
        <Button type="submit" onClick={handleCreatePoll} loading={isSubmitting}>
          Create poll
        </Button>
      </Box>
    </Stack>
  );
};
