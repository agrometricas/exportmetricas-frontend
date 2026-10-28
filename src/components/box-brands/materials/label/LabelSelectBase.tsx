import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useLabels } from '../../../../hooks/box-brand/materials/label/getLabels';
import { LabelType } from '../../../../types/box-brand/materials/label';

interface LabelSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setLabel?: (label: Partial<LabelType> | null) => void;
  onChange?: (newValue: Partial<LabelType>) => void;
}

const LabelSelectBase: React.FC<LabelSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setLabel,
  onChange,
}) => {
  const { data, isLoading, error } = useLabels();

  const handleChange = (newValue: SingleValue<Partial<LabelType>>): void => {
    if (setLabel) setLabel(newValue as Partial<LabelType>);
    if (onChange) onChange(newValue as Partial<LabelType>);
  };

  return (
    <CatalogSelect<Partial<LabelType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay etiqueta/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default LabelSelectBase;
