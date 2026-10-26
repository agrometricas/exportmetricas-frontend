'use client';

import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Kbd,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const { data = [], isFetching, error } = useExportSearch(query);
  const searchable = isSearchable(query);
  // keepPreviousData would leave the last search's hits under an empty box.
  const hits = searchable ? data : [];

  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const activeBg = useColorModeValue('green.50', 'green.900');
  const buttonBg = useColorModeValue('gray.50', 'gray.700');

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
        icon={<FiSearch />}
        variant='ghost'
        color={textColor}
        borderRadius='lg'
        h='44px'
        w='44px'
        onClick={onOpen}
      />
      <Button
        display={{ base: 'none', lg: 'flex' }}
        leftIcon={<FiSearch />}
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
        <Text flex='1' textAlign='left'>
          Buscar exportación…
        </Text>
        <Kbd fontSize='xs'>Ctrl K</Kbd>
      </Button>

      <Modal isOpen={isOpen} onClose={close} size='xl' scrollBehavior='inside'>
        <ModalOverlay />
        <ModalContent mx={4} mt={{ base: 4, md: 24 }}>
          <ModalBody p={4}>
            <InputGroup size='lg'>
              <InputLeftElement pointerEvents='none' color={mutedColor}>
                {isFetching ? <Spinner size='sm' /> : <FiSearch />}
              </InputLeftElement>
              <Input
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
              <Text fontSize='sm' color='red.500' mt={3}>
                {serverErrorMessage(error, 'No se pudo buscar.')}
              </Text>
            )}
            {searchable && !error && !isFetching && hits.length === 0 && (
              <Text fontSize='sm' color={mutedColor} mt={3}>
                Ninguna exportación coincide con «{query}».
              </Text>
            )}

            <List mt={3} spacing={1} role='listbox'>
              {hits.map((hit, index) => {
                const summary = searchHitSummary(hit);
                return (
                  <ListItem
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
                        <Badge colorScheme='red' variant='subtle'>
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
                  </ListItem>
                );
              })}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuickSearch;
