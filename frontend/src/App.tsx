import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";

import { CreatePollForm } from "./Views/CreatePollForm";
import { NoMatch } from "./Views/NoMatch";
import { PageShell } from "./Views/PageShell";
import { Poll } from "./Views/Poll";
import { PollResults } from "./Views/PollResults";
import { useState } from "react";

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
                <Route path=":pollId" element={<Poll />} />
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
