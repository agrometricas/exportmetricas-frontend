import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useStrippings } from '../../../../hooks/box-brand/container/stripping/getStrippings';
import { StrippingType } from '../../../../types/box-brand/container/stripping';

interface StrippingSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setStripping?: (stripping: Partial<StrippingType>) => void;
  onChange?: (newValue: Partial<StrippingType>) => void;
}

const StrippingSelectBase: React.FC<StrippingSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setStripping,
  onChange,
}) => {
  const { data, isLoading, error } = useStrippings();

  const handleChange = (
    newValue: SingleValue<Partial<StrippingType>>
  ): void => {
    if (setStripping) setStripping(newValue as Partial<StrippingType>);
    if (onChange) onChange(newValue as Partial<StrippingType>);
  };

  return (
    <CatalogSelect<Partial<StrippingType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay zuncho/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default StrippingSelectBase;
