'use client';

import { Button, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import ConfirmationModal from './ConfirmationModal';

interface OpenWithConfirmationProps {
  href: string;
  label: string;
  title: string;
  description: string;
}

const OpenWithConfirmation: React.FC<OpenWithConfirmationProps> = ({
  href,
  label,
  title,
  description,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  return (
    <>
      <Button size='sm' colorScheme='green' onClick={onOpen}>
        {label}
      </Button>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => router.push(href)}
        title={title}
        description={description}
      />
    </>
  );
};

export default OpenWithConfirmation;
