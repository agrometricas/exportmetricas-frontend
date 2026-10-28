import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useTransports } from '../../hooks/transport/getTransports';
import { TransportResponse } from '../../types/transport/transport.response';

interface TransportSelectBaseProps {
  name?: string;
  field?: FieldInputProps<unknown>;
  placeholder: string;
  setTransport?: (transport: Partial<TransportResponse>) => void;
  onChange?: (newValue: Partial<TransportResponse>) => void;
}

const TransportSelectBase: React.FC<TransportSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setTransport,
}) => {
  const { data = [], isLoading, error } = useTransports();
  const handleChange = (
    newValue: SingleValue<Partial<TransportResponse>>
  ): void => {
    if (setTransport) {
      setTransport(newValue as Partial<TransportResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<TransportResponse>);
    }
  };

  return (
    <CatalogSelect<Partial<TransportResponse>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'No hay trasnportes disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default TransportSelectBase;
