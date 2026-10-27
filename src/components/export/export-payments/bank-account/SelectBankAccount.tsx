import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldBankAccountSelect from './InputFieldBankAccountSelect';
import { BankAccountType } from '../../../../types/bankAccount';
import { FormLabel } from '../../../ui/form/FormLabel';

interface SelectBankAccountProps {
  name: string;
  label?: string;
  bankAccountSelect?: Partial<BankAccountType>;
  setBankAccountSelect?: (bankAccount: Partial<BankAccountType> | null) => void;
}

const SelectBankAccount: React.FC<SelectBankAccountProps> = ({
  name,
  label,
  bankAccountSelect,
  setBankAccountSelect,
}) => {
  const [bankAccount, setBankAccount] =
    useState<Partial<BankAccountType> | null>(null);

  useEffect(() => {
    if (!!bankAccountSelect) {
      setBankAccount(bankAccountSelect);
    }
  }, [bankAccountSelect]);

  useEffect(() => {
    if (!!setBankAccountSelect) {
      setBankAccountSelect(bankAccount);
    }
  }, [bankAccount, setBankAccountSelect]);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
      <InputFieldBankAccountSelect
        name={name}
        label={label ? label : 'Productor/Razón Social'}
        placeholder={'Selecciona el productor'}
        setBankAccount={setBankAccount}
      />

      <Box>
        <FormLabel>Tipo</FormLabel>
        <Input
          readOnly={true}
          value={bankAccount?.type || ''}
          placeholder='Tipo de Cuenta'
        />
      </Box>
      <Box>
        <FormLabel>Propietario</FormLabel>
        <Input
          readOnly={true}
          value={bankAccount?.owner || ''}
          placeholder='Nombre del Propietario'
        />
      </Box>
      <Box>
        <FormLabel>Identificación</FormLabel>
        <Input
          readOnly={true}
          value={bankAccount?.ownerID || ''}
          placeholder='Identificación del Propietario'
        />
      </Box>
    </SimpleGrid>
  );
};

export default SelectBankAccount;
