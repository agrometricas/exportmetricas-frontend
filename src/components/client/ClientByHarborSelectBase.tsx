import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useClientsByHarborId } from '../../hooks/export/client/getClientsByHarborId';
import { ClientType } from '../../types/client';

interface ClientByHarborSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  harbor?: number;
  setClient?: (client: Partial<ClientType>) => void;
  onChange?: (newValue: Partial<ClientType>) => void;
}

const ClientByHarborSelectBase: React.FC<ClientByHarborSelectBaseProps> = ({
  name,
  placeholder,
  field,
  harbor,
  onChange,
  setClient,
}) => {
  const { data, isLoading, error } = useClientsByHarborId({ id: harbor ?? 0 });

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
      placeholder={placeholder}
    />
  );
};

export default ClientByHarborSelectBase;
