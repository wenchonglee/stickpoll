import { Anchor, AppShell, Grid, Group, Header, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Helmet } from "react-helmet";
import { Link, Outlet, useMatch } from "react-router-dom";
import { GithubLink } from "../component/GithubLink";

export const PageShell = () => {
  const pathMatch = useMatch("/");
  const isRootPage = !!pathMatch;
  const isSmallWidth = useMediaQuery("(max-width: 800px)");

  return (
    <AppShell
      padding={isSmallWidth ? "md" : "xl"}
      header={
        isSmallWidth ? (
          <Header height={64} p="md">
            <Group position="apart">
              <Anchor component={Link} to="/">
                <Title
                  order={2}
                  sx={{
                    color: "white",
                  }}
                >
                  Stickpoll
                </Title>
              </Anchor>

              <GithubLink />
            </Group>
          </Header>
        ) : undefined
      }
    >
      <Helmet>
        <meta name="og:description" content="Create anonymous polls and view results in real time" />
      </Helmet>
      <Grid
        justify="center"
        align="flex-start"
        sx={(theme) => ({
          padding: theme.spacing.md,
          marginTop: "0px",
          "@media (max-width: 800px)": {
            padding: "0px",
          },
          "@media (min-width: 1201px)": {
            padding: "128px",
            marginTop: "64px",
          },
        })}
      >
        {!isSmallWidth && (
          <Grid.Col
            md={12}
            lg={isRootPage ? 6 : 4}
            sx={{
              transition: "max-width 1s",
              display: "flex",
              justifyContent: isSmallWidth ? "flex-start" : "center",
            }}
          >
            <Stack spacing="xs">
              <Anchor component={Link} to="/">
                <Text
                  color="white"
                  sx={{
                    fontSize: isRootPage ? "3rem" : "2rem",
                    lineHeight: "0rem",
                  }}
                >
                  <h1>Stickpoll</h1>
                </Text>
              </Anchor>

              <GithubLink />
            </Stack>
          </Grid.Col>
        )}

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
