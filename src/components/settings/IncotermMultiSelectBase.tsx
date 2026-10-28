import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useIncoterms } from '../../hooks/export/client/incoterm/getIncoterms';

export interface IncotermType {
  id: number;
  name: string;
}

interface IncotermMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number[]>;
  placeholder: string;
  setIncoterms?: (incoterms: Partial<IncotermType>[]) => void;
  onChange?: (newValues: Partial<IncotermType>[]) => void;
}

const IncotermMultiSelectBase: React.FC<IncotermMultiSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setIncoterms,
}) => {
  const { data, isLoading, error } = useIncoterms();

  const handleChange = (newValues: MultiValue<Partial<IncotermType>>): void => {
    if (setIncoterms) {
      setIncoterms(newValues as Partial<IncotermType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<IncotermType>[]);
    }
  };

  return (
    <CatalogMultiSelect<Partial<IncotermType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay puerto/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValues) =>
        handleChange(newValues as Partial<IncotermType>[])
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
    />
  );
};

export default IncotermMultiSelectBase;
