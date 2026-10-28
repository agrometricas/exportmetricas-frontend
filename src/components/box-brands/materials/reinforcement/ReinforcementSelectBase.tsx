import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useReinforcements } from '@/hooks/box-brand/materials/reinforcement/getReinforcements';
import { ReinforcementType } from '@/types/box-brand/materials/reinforcement';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface ReinforcementSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setReinforcement?: (reinforcement: Partial<ReinforcementType>) => void;
  onChange?: (newValue: Partial<ReinforcementType>) => void;
}

const ReinforcementSelectBase: React.FC<ReinforcementSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setReinforcement,
  onChange,
}) => {
  const { data, isLoading, error } = useReinforcements();

  const handleChange = (
    newValue: SingleValue<Partial<ReinforcementType>>
  ): void => {
    if (setReinforcement)
      setReinforcement(newValue as Partial<ReinforcementType>);
    if (onChange) onChange(newValue as Partial<ReinforcementType>);
  };

  return (
    <CatalogSelect<Partial<ReinforcementType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error
          ? serverErrorMessage(error)
          : 'Ya no hay reinforcement/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default ReinforcementSelectBase;
