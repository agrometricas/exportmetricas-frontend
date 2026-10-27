'use client';
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Kbd,
  List,
  Spinner,
  Text,
  useDisclosure,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useExportSearch } from '../../../hooks/export/searchExports';
import { isSearchable, searchHitSummary } from '../../../utils/exportSearch';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';

const DEBOUNCE_MS = 250;

const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

const QuickSearch = (): React.JSX.Element => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const { data = [], isFetching, error } = useExportSearch(query);
  const searchable = isSearchable(query);
  // keepPreviousData would leave the last search's hits under an empty box.
  const hits = searchable ? data : [];

  const textColor = 'fg';
  const mutedColor = 'fg.muted';
  const activeBg = 'green.subtle';
  const buttonBg = 'bg.subtle';

  useEffect(() => {
    const timer = setTimeout(() => setQuery(text.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent): void => {
      const withModifier =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const slash = event.key === '/' && !isTyping(event.target);
      if (!withModifier && !slash) return;
      event.preventDefault();
      onOpen();
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [onOpen]);

  const close = (): void => {
    onClose();
    setText('');
    setQuery('');
  };

  const open = (exportId: number): void => {
    close();
    router.push(`/dashboard/export/${exportId}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, hits.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && hits[active]) {
      event.preventDefault();
      open(hits[active].exportId);
    }
  };

  return (
    <>
      <IconButton
        aria-label='Buscar una exportación'
        display={{ base: 'flex', lg: 'none' }}
        variant='ghost'
        color={textColor}
        borderRadius='lg'
        h='44px'
        w='44px'
        onClick={onOpen}
      >
        <FiSearch />
      </IconButton>
      <Button
        display={{ base: 'none', lg: 'flex' }}
        variant='outline'
        bg={buttonBg}
        color={mutedColor}
        fontWeight='normal'
        borderRadius='lg'
        h='44px'
        minW='260px'
        justifyContent='flex-start'
        onClick={onOpen}
      >
        <FiSearch />
        <Text flex='1' textAlign='left'>
          Buscar exportación…
        </Text>
        <Kbd size='sm' wordSpacing='normal'>
          Ctrl K
        </Kbd>
      </Button>

      <Dialog.Root
        open={isOpen}
        size='xl'
        scrollBehavior='inside'
        onOpenChange={(e) => {
          if (!e.open) {
            close();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content mx={4} mt={{ base: 4, md: 24 }}>
              <Dialog.Body p={4}>
                <InputGroup
                  startElement={
                    isFetching ? <Spinner size='sm' /> : <FiSearch />
                  }
                  startElementProps={{
                    pointerEvents: 'none',
                    color: mutedColor,
                  }}
                >
                  <Input
                    size='lg'
                    autoFocus
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder='Número, booking, contenedor, finca, productor o cliente'
                    aria-label='Buscar una exportación'
                  />
                </InputGroup>

                {!searchable && (
                  <Text fontSize='sm' color={mutedColor} mt={3}>
                    Escribe al menos dos letras o el número de la exportación.
                  </Text>
                )}
                {searchable && !!error && (
                  <Text fontSize='sm' color='red.fg' mt={3}>
                    {serverErrorMessage(error, 'No se pudo buscar.')}
                  </Text>
                )}
                {searchable && !error && !isFetching && hits.length === 0 && (
                  <Text fontSize='sm' color={mutedColor} mt={3}>
                    Ninguna exportación coincide con «{query}».
                  </Text>
                )}

                <List.Root mt={3} gap={1} role='listbox'>
                  {hits.map((hit, index) => {
                    const summary = searchHitSummary(hit);
                    return (
                      <List.Item
                        key={hit.exportId}
                        role='option'
                        aria-selected={index === active}
                        px={3}
                        py={2}
                        borderRadius='md'
                        cursor='pointer'
                        bg={index === active ? activeBg : 'transparent'}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => open(hit.exportId)}
                      >
                        <Flex align='center' gap={2}>
                          <Text fontWeight='semibold'>{summary.title}</Text>
                          {hit.cancelled && (
                            <Badge colorPalette='red' variant='subtle'>
                              Cancelada
                            </Badge>
                          )}
                        </Flex>
                        <Text fontSize='sm' color={textColor}>
                          {summary.detail}
                        </Text>
                        {summary.logistics && (
                          <Box fontSize='xs' color={mutedColor}>
                            {summary.logistics}
                          </Box>
                        )}
                      </List.Item>
                    );
                  })}
                </List.Root>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default QuickSearch;
