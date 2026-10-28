import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useMettoLabels } from '../../../../hooks/box-brand/container/metto-label/getMettoLabels';
import { MettoLabelType } from '../../../../types/box-brand/container/mettoLabel';

interface MettoLabelSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setMettoLabel?: (mettoLabel: Partial<MettoLabelType>) => void;
  onChange?: (newValue: Partial<MettoLabelType>) => void;
}

const MettoLabelSelectBase: React.FC<MettoLabelSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setMettoLabel,
  onChange,
}) => {
  const { data, isLoading, error } = useMettoLabels();

  const handleChange = (
    newValue: SingleValue<Partial<MettoLabelType>>
  ): void => {
    if (setMettoLabel) setMettoLabel(newValue as Partial<MettoLabelType>);
    if (onChange) onChange(newValue as Partial<MettoLabelType>);
  };

  return (
    <CatalogSelect<Partial<MettoLabelType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay etiqueta/s metto disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default MettoLabelSelectBase;
