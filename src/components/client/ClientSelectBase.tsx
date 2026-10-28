import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useClients } from '../../hooks/export/client/getClients';
import { ClientResponse } from '../../types/client.response';

interface ClientSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setClient?: (client: Partial<ClientResponse>) => void;
  onChange?: (newValue: Partial<ClientResponse>) => void;
}

const ClientSelectBase: React.FC<ClientSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setClient,
}) => {
  const { data, isLoading, error } = useClients();

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
      value={
        field?.value
          ? data?.find(
              (opt: Partial<ClientResponse>) => opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default ClientSelectBase;
