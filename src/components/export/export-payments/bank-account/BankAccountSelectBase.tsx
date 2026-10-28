import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useBankAccounts } from '../../../../hooks/bank-account/getBankAccounts';
import { BankAccountType } from '../../../../types/bankAccount';

interface BankAccountSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setBankAccount?: (bankAccount: Partial<BankAccountType>) => void;
  onChange?: (newValue: Partial<BankAccountType>) => void;
}

const BankAccountSelectBase: React.FC<BankAccountSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setBankAccount,
}) => {
  const { data, isLoading } = useBankAccounts();

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
    <CatalogSelect<Partial<BankAccountType>>
      field={field}
      name={name}
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
    />
  );
};

export default BankAccountSelectBase;
