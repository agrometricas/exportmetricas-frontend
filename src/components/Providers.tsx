'use client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { createTheme as createMuiTheme, THEME_ID } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SidenavProvider from './ui/sidenav/sidenav-context';

interface Props {
  children: ReactNode;
}

const muiTheme = createMuiTheme();
const theme = extendTheme();

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

const Providers = ({ children }: Props): React.JSX.Element => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ChakraProvider theme={{ ...theme, [THEME_ID]: muiTheme }} resetCSS>
        <QueryClientProvider client={queryClient}>
          <SidenavProvider>{children}</SidenavProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default Providers;
