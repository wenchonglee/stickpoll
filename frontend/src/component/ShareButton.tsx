import { Button, Input, InputWrapper } from "@mantine/core";
import { useState } from "react";

export const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  return (
    <InputWrapper label="Share poll link">
      <Input
        sx={{
          maxWidth: "400px",
          "& input": {
            textOverflow: "ellipsis",
          },
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
    </InputWrapper>
  );
};
