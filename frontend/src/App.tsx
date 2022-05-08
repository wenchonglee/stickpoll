import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NoMatch } from "./view/NoMatch";
import { PageShell } from "./view/PageShell";
import { CreatePollForm } from "./view/poll/CreatePollForm";
import { PollResults } from "./view/poll/PollResults";
import { PollShell } from "./view/poll/PollShell";
import { VotePollForm } from "./view/poll/VotePollForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{
            fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
            colorScheme: colorScheme,
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PageShell />}>
                  <Route index element={<CreatePollForm />} />
                  <Route path=":pollId" element={<PollShell />}>
                    <Route index element={<VotePollForm />} />
                    <Route path="results" element={<PollResults />} />
                  </Route>
                </Route>

                <Route path="*" element={<NoMatch />} />
              </Routes>
            </BrowserRouter>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}
export default App;
