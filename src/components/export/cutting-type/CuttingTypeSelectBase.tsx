import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useCuttingTypes } from '../../../hooks/export/cutting-type/getCuttingTypes';
import { CuttingType } from '../../../types/cuttingType';

interface CuttingTypeSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setCuttingType?: (cuttingType: Partial<CuttingType>) => void;
  onChange?: (newValue: Partial<CuttingType>) => void;
}

const CuttingTypeSelectBase: React.FC<CuttingTypeSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setCuttingType,
}) => {
  const { data = [], isLoading, error } = useCuttingTypes();

  const handleChange = (newValue: SingleValue<Partial<CuttingType>>): void => {
    if (setCuttingType) {
      setCuttingType(newValue as Partial<CuttingType>);
    }

    if (onChange) {
      onChange(newValue as Partial<CuttingType>);
    }
  };

  return (
    <CatalogSelect<Partial<CuttingType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay corte/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<CuttingType>) => `${opt.shipmentType}`}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default CuttingTypeSelectBase;
