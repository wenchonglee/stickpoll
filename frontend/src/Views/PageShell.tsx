import { AppShell, Grid, Text } from "@mantine/core";

import { Outlet } from "react-router-dom";

export const PageShell = () => {
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
        <Grid.Col md={12} lg={6}>
          <Text
            color="white"
            sx={{
              fontSize: "3rem",
              lineHeight: "1rem",
            }}
            align="center"
          >
            <h1>Stickpoll</h1>
          </Text>
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
        </Grid.Col>

        <Grid.Col md={12} lg={6}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </AppShell>
  );
};
