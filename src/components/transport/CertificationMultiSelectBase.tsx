import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useCertifications } from '../../hooks/utils/getCertifications';

export interface Certification {
  id: number;
  name: string;
}

interface CertificationMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number[]>;
  placeholder: string;
  setCertifications?: (certificates: Partial<Certification>[]) => void;
  onChange?: (newValues: Partial<Certification>[]) => void;
}

const CertificationMultiSelectBase: React.FC<
  CertificationMultiSelectBaseProps
> = ({ name, placeholder, field, onChange, setCertifications }) => {
  const { data, isLoading, error } = useCertifications();

  const handleChange = (
    newValues: MultiValue<Partial<Certification>>
  ): void => {
    if (setCertifications) {
      setCertifications(newValues as Partial<Certification>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<Certification>[]);
    }
  };

  return (
    <CatalogMultiSelect<Partial<Certification>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay certificados disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionValue={(opt: Partial<Certification>) =>
        opt.id ? String(opt.id) : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<Certification>[])
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
    />
  );
};

export default CertificationMultiSelectBase;
