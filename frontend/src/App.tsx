import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreatePollForm } from "./view/CreatePollForm";
import { NoMatch } from "./view/NoMatch";
import { PageShell } from "./view/PageShell";
import { PollResults } from "./view/PollResults";
import { VotePollForm } from "./view/VotePollForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PageShell />}>
                <Route index element={<CreatePollForm />} />
                <Route path=":pollId" element={<VotePollForm />} />
                <Route path=":pollId/results" element={<PollResults />} />
              </Route>

              <Route path="*" element={<NoMatch />} />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}
export default App;
