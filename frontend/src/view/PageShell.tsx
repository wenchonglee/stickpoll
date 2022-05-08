import { AppShell, Box, Button, Grid, Image, Stack, Text } from "@mantine/core";
import { Outlet, useMatch } from "react-router-dom";
import GithubLogo from "../img/github.png";

export const PageShell = () => {
  const pathMatch = useMatch("/");
  const isRootPage = !!pathMatch;

  return (
    <AppShell padding="xl">
      <Grid
        justify="center"
        align="flex-start"
        sx={(theme) => ({
          padding: theme.spacing.md,
          marginTop: "0px",
          "@media (min-width: 1201px)": {
            padding: "128px",
            marginTop: "128px",
          },
        })}
      >
        <Grid.Col
          md={12}
          lg={isRootPage ? 6 : 4}
          sx={{
            transition: "max-width 1s",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack spacing="xs">
            <Text
              color="white"
              sx={{
                fontSize: isRootPage ? "3rem" : "2rem",
                lineHeight: "0rem",
              }}
            >
              <h1>Stickpoll</h1>
            </Text>

            <Text size="xs" color="yellow">
              Create public, anonymous polls <br />
              View results in real time
            </Text>

            <Box>
              <Button
                component="a"
                href="https://github.com/wenchonglee/stickpoll"
                variant="subtle"
                size="xs"
                color="gray"
                leftIcon={<Image src={GithubLogo} width={20} height={20} />}
              >
                Source code
              </Button>
            </Box>
          </Stack>
        </Grid.Col>

        <Grid.Col
          md={12}
          lg={isRootPage ? 6 : 8}
          sx={{
            transition: "max-width 1s",
          }}
        >
          <Outlet />
        </Grid.Col>
      </Grid>
    </AppShell>
  );
};
