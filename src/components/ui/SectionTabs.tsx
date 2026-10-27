'use client';

import { Tabs } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { SectionTab, activeSectionTab } from './sidenav/menuActive';

interface SectionTabsProps {
  tabs: SectionTab[];
}

const SectionTabs: React.FC<SectionTabsProps> = ({ tabs }) => {
  const pathname = usePathname();
  const index = activeSectionTab(pathname, tabs);
  const listRef = useRef<HTMLDivElement>(null);

  // On a narrow screen the row scrolls sideways: bring the current tab into it.
  useEffect(() => {
    const list = listRef.current;
    const active = list?.children[index] as HTMLElement | undefined;
    if (!list || !active) return;
    list.scrollLeft = active.offsetLeft - list.offsetLeft;
  }, [index]);

  return (
    <Tabs.Root
      value={tabs[index]?.to ?? null}
      variant='subtle'
      colorPalette='green'
      size='sm'
      mb={4}
    >
      <Tabs.List
        ref={listRef}
        overflowX='auto'
        flexWrap='nowrap'
        gap={1}
        pb={1}
      >
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.to} value={tab.to} flexShrink={0} asChild>
            <NextLink href={tab.to}>{tab.label}</NextLink>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
};

export default SectionTabs;
