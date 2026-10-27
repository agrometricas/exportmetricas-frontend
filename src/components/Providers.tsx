'use client';
import { ChakraProvider } from '@chakra-ui/react';
import {
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ColorModeProvider, useColorMode } from './ui/color-mode';
import SidenavProvider from './ui/sidenav/sidenav-context';
import { Toaster } from './ui/toaster';
import { brandMuiTheme } from '../theme/muiTheme';
import { system } from '../theme/system';

interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // With an infinite staleTime only an invalidated query is stale, and it
      // has to load again when its page mounts: invalidating from a form that
      // then navigates away happens while that page is not mounted.
      refetchOnMount: true,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

function TablesTheme({ children }: Props): React.JSX.Element {
  const { colorMode } = useColorMode();
  const theme = useMemo(
    () => ({
      [THEME_ID]: brandMuiTheme(colorMode === 'dark' ? 'dark' : 'light'),
    }),
    [colorMode]
  );
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

const Providers = ({ children }: Props): React.JSX.Element => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ChakraProvider value={system}>
        <ColorModeProvider defaultTheme='light' enableSystem={false}>
          <TablesTheme>
            <QueryClientProvider client={queryClient}>
              <SidenavProvider>{children}</SidenavProvider>
            </QueryClientProvider>
          </TablesTheme>
          <Toaster />
        </ColorModeProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default Providers;
