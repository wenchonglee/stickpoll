import { Box, Text } from "@mantine/core";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface SelectItemProps extends ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ image, label, description, ...others }: SelectItemProps, ref) => (
    <Box ref={ref} {...others}>
      <Box>
        <Text size="sm">{label}</Text>
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      </Box>
    </Box>
  )
);
