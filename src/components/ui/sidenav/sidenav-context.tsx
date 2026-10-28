import { useDisclosure } from '@chakra-ui/react';
import { createContext, useContext } from 'react';

const SidenavContext = createContext<ReturnType<typeof useDisclosure> | null>(
  null
);

export function useSidenav(): ReturnType<typeof useDisclosure> {
  const sidebar = useContext(SidenavContext);
  if (!sidebar) {
    throw new Error('Cannot use `sidebar context` outside SidebarProvider');
  }
  return { ...(sidebar as ReturnType<typeof useDisclosure>) };
}

export function SidenavProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const disclosure = useDisclosure();
  return (
    <SidenavContext.Provider value={{ ...disclosure }} {...props}>
      {children}
    </SidenavContext.Provider>
  );
}

export default SidenavProvider;
