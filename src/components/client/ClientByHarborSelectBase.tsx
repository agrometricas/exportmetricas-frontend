import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useClientsByHarborId } from '../../hooks/export/client/getClientsByHarborId';
import { ClientResponse } from '../../types/client.response';

interface ClientByHarborSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  harbor?: number;
  setClient?: (client: Partial<ClientResponse>) => void;
  onChange?: (newValue: Partial<ClientResponse>) => void;
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

  const handleChange = (
    newValue: SingleValue<Partial<ClientResponse>>
  ): void => {
    if (setClient) {
      setClient(newValue as Partial<ClientResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<ClientResponse>);
    }
  };

  return (
    <CatalogSelect<Partial<ClientResponse>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay cliente/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<ClientResponse>) => `${opt.businessName}`}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default ClientByHarborSelectBase;
