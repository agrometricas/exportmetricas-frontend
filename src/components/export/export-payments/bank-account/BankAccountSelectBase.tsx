import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useBankAccounts } from '../../../../hooks/bank-account/getBankAccounts';
import { BankAccountResponse } from '../../../../types/bankAccount.response';

interface BankAccountSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setBankAccount?: (bankAccount: Partial<BankAccountResponse>) => void;
  onChange?: (newValue: Partial<BankAccountResponse>) => void;
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
    newValue: SingleValue<Partial<BankAccountResponse>>
  ): void => {
    if (setBankAccount) {
      setBankAccount(newValue as Partial<BankAccountResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<BankAccountResponse>);
    }
  };

  return (
    <CatalogSelect<Partial<BankAccountResponse>>
      field={field}
      name={name}
      noOptionsMessage={() => 'bank account not found'}
      isLoading={isLoading}
      options={data}
      getOptionLabel={(bankAccount: Partial<BankAccountResponse>) =>
        `${bankAccount.bank} - ${bankAccount.accountNumber} - ${bankAccount.owner} `
      }
      getOptionValue={(bankAccount: Partial<BankAccountResponse>) =>
        bankAccount.id !== undefined && bankAccount.id !== null
          ? bankAccount.id.toString()
          : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<BankAccountResponse>) => opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default BankAccountSelectBase;
