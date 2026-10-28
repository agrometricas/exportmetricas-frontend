import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useClients } from '../../hooks/export/client/getClients';
import { ClientType } from '../../types/client';

interface ClientSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setClient?: (client: Partial<ClientType>) => void;
  onChange?: (newValue: Partial<ClientType>) => void;
}

const ClientSelectBase: React.FC<ClientSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setClient,
}) => {
  const { data, isLoading, error } = useClients();

  const handleChange = (newValue: SingleValue<Partial<ClientType>>): void => {
    if (setClient) {
      setClient(newValue as Partial<ClientType>);
    }

    if (onChange) {
      onChange(newValue as Partial<ClientType>);
    }
  };

  return (
    <CatalogSelect<Partial<ClientType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay cliente/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<ClientType>) => `${opt.businessName}`}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<ClientType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default ClientSelectBase;
