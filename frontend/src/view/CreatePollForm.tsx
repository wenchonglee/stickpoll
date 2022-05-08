import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Input, InputWrapper, Select, Stack, Text, Textarea } from "@mantine/core";
import { DuplicationCheckEnum, PollFormSchema } from "@stickpoll/models";
import { forwardRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCreatePoll } from "../api";

// Because useFieldArray only support array of objects, we have to alter the schema here
const RhfPollFormSchema = PollFormSchema.extend({
  options: z.array(
    z.object({
      value: z.string().min(1, { message: "Option cannot be empty" }),
    })
  ),
});
type RhfPollForm = z.infer<typeof RhfPollFormSchema>;

export const CreatePollForm = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useCreatePoll();
  const { register, control, handleSubmit, formState } = useForm<RhfPollForm>({
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
      duplicationCheck: DuplicationCheckEnum.enum.ip_address,
    },
    resolver: zodResolver(RhfPollFormSchema),
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
        duplicationCheck: formData.duplicationCheck,
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

      <Controller
        control={control}
        name="duplicationCheck"
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            label="Duplication check"
            placeholder="Pick one"
            itemComponent={SelectItem}
            data={data}
            maxDropdownHeight={400}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            disabled={isSubmitting}
            sx={{
              maxWidth: "400px",
            }}
          />
        )}
      />

      <Box>
        <Button type="submit" onClick={handleCreatePoll} loading={isSubmitting}>
          Create poll
        </Button>
      </Box>
    </Stack>
  );
};

const data = [
  {
    label: "IP Address",
    value: DuplicationCheckEnum.enum.ip_address,
    description: "Participants are restricted to only 1 vote, based on their IP Address",
  },
  {
    label: "None",
    value: DuplicationCheckEnum.enum.none,
    description: "No restrictions, participants can vote multiple times",
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ image, label, description, ...others }: ItemProps, ref) => (
  <div ref={ref} {...others}>
    <div>
      <Text size="sm">{label}</Text>
      <Text size="xs" color="dimmed">
        {description}
      </Text>
    </div>
  </div>
));
