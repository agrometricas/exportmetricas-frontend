import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { usePesticides } from '../../../../hooks/box-brand/post-harvest/pesticide/getPesticides';
import { PesticideType } from '../../../../types/box-brand/post-harvest/pesticide';

interface PesticideSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setPesticide?: (pesticide: Partial<PesticideType>) => void;
  onChange?: (newValue: Partial<PesticideType>) => void;
}

const PesticideSelectBase: React.FC<PesticideSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setPesticide,
  onChange,
}) => {
  const { data = [], isLoading, error } = usePesticides();

  useEffect(() => {
    if (!!setPesticide)
      setPesticide(
        (data as Partial<PesticideType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<PesticideType>
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field?.value]);

  const handleChange = (
    newValue: SingleValue<Partial<PesticideType>>
  ): void => {
    if (setPesticide) {
      setPesticide(newValue as Partial<PesticideType>);
    }
    if (onChange) {
      onChange(newValue as Partial<PesticideType>);
    }
  };

  return (
    <CatalogSelect<Partial<PesticideType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay pesticida/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<PesticideType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default PesticideSelectBase;
