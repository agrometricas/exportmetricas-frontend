/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  SingleValue,
  chakraComponents,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useBankAccounts } from '../../../../hooks/bank-account/getBankAccounts';
import { usePagination } from '../../../../hooks/usePagination';
import { BankAccountType } from '../../../../types/bankAccount';

interface BankAccountSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setBankAccount?: (bankAccount: Partial<BankAccountType>) => void;
  onChange?: (newValue: Partial<BankAccountType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<BankAccountType>,
  false,
  GroupBase<Partial<BankAccountType>>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'gray.600',
  }),
  input: (provided) => ({
    ...provided,
    color: 'gray.900',
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'gray.200',
  }),
};

const bankAccountComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<BankAccountType>,
      false,
      GroupBase<Partial<BankAccountType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const BankAccountSelectBase: React.FC<BankAccountSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setBankAccount,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading } = useBankAccounts(paginationParams);

  const handleChange = (
    newValue: SingleValue<Partial<BankAccountType>>
  ): void => {
    if (setBankAccount) {
      setBankAccount(newValue as Partial<BankAccountType>);
    }

    if (onChange) {
      onChange(newValue as Partial<BankAccountType>);
    }
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (provided) =>
          ({ ...provided, zIndex: 100 }) as CSSObjectWithLabel,
      }}
      useBasicStyles
      chakraStyles={chakraStyles}
      noOptionsMessage={() => 'bank account not found'}
      isLoading={isLoading}
      options={data}
      getOptionLabel={(bankAccount: Partial<BankAccountType>) =>
        `${bankAccount.bank} - ${bankAccount.accountNumber} - ${bankAccount.owner} `
      }
      getOptionValue={(bankAccount: Partial<BankAccountType>) =>
        bankAccount.id !== undefined && bankAccount.id !== null
          ? bankAccount.id.toString()
          : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<BankAccountType>) => opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
      components={bankAccountComponents}
    />
  );
};

export default BankAccountSelectBase;
