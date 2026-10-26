'use client';

import { Tab, TabList, Tabs } from '@chakra-ui/react';
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
    <Tabs
      index={index}
      variant='soft-rounded'
      colorScheme='green'
      size='sm'
      mb={4}
    >
      <TabList
        ref={listRef}
        overflowX='auto'
        flexWrap='nowrap'
        gap={1}
        pb={1}
      >
        {tabs.map((tab) => (
          <Tab key={tab.to} as={NextLink} href={tab.to} flexShrink={0}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default SectionTabs;
