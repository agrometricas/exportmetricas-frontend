import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldBankAccountSelect from './InputFieldBankAccountSelect';
import { BankAccountResponse } from '../../../../types/bankAccount.response';
import { FormLabel } from '../../../ui/form/FormLabel';

interface SelectBankAccountProps {
  name: string;
  label?: string;
  bankAccountSelect?: Partial<BankAccountResponse>;
  setBankAccountSelect?: (
    bankAccount: Partial<BankAccountResponse> | null
  ) => void;
}

const SelectBankAccount: React.FC<SelectBankAccountProps> = ({
  name,
  label,
  bankAccountSelect,
  setBankAccountSelect,
}) => {
  const [bankAccount, setBankAccount] =
    useState<Partial<BankAccountResponse> | null>(null);

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
        label={label ? label : 'Productor/Razón social'}
        placeholder={'Selecciona el productor'}
        setBankAccount={setBankAccount}
      />

      <Box>
        <FormLabel>Tipo</FormLabel>
        <Input
          readOnly={true}
          value={bankAccount?.type || ''}
          placeholder='Tipo de cuenta'
        />
      </Box>
      <Box>
        <FormLabel>Propietario</FormLabel>
        <Input
          readOnly={true}
          value={bankAccount?.owner || ''}
          placeholder='Nombre del propietario'
        />
      </Box>
      <Box>
        <FormLabel>Identificación</FormLabel>
        <Input
          readOnly={true}
          value={bankAccount?.ownerID || ''}
          placeholder='Identificación del propietario'
        />
      </Box>
    </SimpleGrid>
  );
};

export default SelectBankAccount;
