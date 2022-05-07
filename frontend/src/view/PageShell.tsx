import { Anchor, AppShell, Grid, Group, Image, Text } from "@mantine/core";
import { Outlet, useMatch } from "react-router-dom";
import GithubLogo from "../img/github.png";

export const PageShell = () => {
  const isRootPage = useMatch("/");

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
          }}
        >
          <Text
            color="white"
            sx={{
              fontSize: isRootPage ? "3rem" : "2rem",
              lineHeight: "1rem",
            }}
            align="center"
          >
            <h1>Stickpoll</h1>
          </Text>

          <Group position="center" spacing="xs">
            <Anchor href="https://github.com/wenchonglee/stickpoll">
              <Image src={GithubLogo} width={20} height={20} />
            </Anchor>

            <Text
              size="xs"
              align="center"
              color="yellow"
              sx={{
                fontStyle: "italic",
              }}
            >
              Like strawpoll, but another material, idk
            </Text>
          </Group>
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
