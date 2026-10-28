import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { usePesticides } from '../../../../hooks/box-brand/post-harvest/pesticide/getPesticides';
import { PesticideType } from '../../../../types/box-brand/post-harvest/pesticide';

interface PesticideMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number[]>;
  placeholder: string;
  setPesticides?: (pesticides: Partial<PesticideType>[]) => void;
  onChange?: (newValues: Partial<PesticideType>[]) => void;
}

const PesticideMultiSelectBase: React.FC<PesticideMultiSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setPesticides,
}) => {
  const { data, isLoading, error } = usePesticides();

  const handleChange = (
    newValues: MultiValue<Partial<PesticideType>>
  ): void => {
    if (setPesticides) {
      setPesticides(newValues as Partial<PesticideType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<PesticideType>[]);
    }
  };

  return (
    <CatalogMultiSelect<Partial<PesticideType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay pesticida/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(pesticide: Partial<PesticideType>) =>
        `${pesticide.brandName} - ${pesticide.name}`
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<PesticideType>[])
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
    />
  );
};

export default PesticideMultiSelectBase;
