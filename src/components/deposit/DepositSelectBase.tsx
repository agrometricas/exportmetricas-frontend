import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useDeposits } from '../../hooks/deposit/getDeposits';
import { DepositResponse } from '../../types/deposit/deposit.response';

interface DepositSelectBaseProps {
  name?: string;
  field?: FieldInputProps<unknown>;
  placeholder: string;
  setDeposit?: (deposit: Partial<DepositResponse>) => void;
  onChange?: (newValue: Partial<DepositResponse>) => void;
}

const DepositSelectBase: React.FC<DepositSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setDeposit,
}) => {
  const { data = [], isLoading, error } = useDeposits();

  const handleChange = (
    newValue: SingleValue<Partial<DepositResponse>>
  ): void => {
    if (setDeposit) {
      setDeposit(newValue as Partial<DepositResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<DepositResponse>);
    }
  };

  return (
    <CatalogSelect<Partial<DepositResponse>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'No hay depositos disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default DepositSelectBase;
