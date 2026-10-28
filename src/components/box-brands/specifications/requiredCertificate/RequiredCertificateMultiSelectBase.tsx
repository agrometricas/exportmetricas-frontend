import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useRequiredCertificates } from '../../../../hooks/box-brand/specifications/certificate/getRequiredCertificates';
import { RequiredCertificateType } from '../../../../types/box-brand/specifications/requiredCertificate';

interface RequiredCertificateMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number[]>;
  placeholder: string;
  setCertificates?: (certificates: Partial<RequiredCertificateType>[]) => void;
  onChange?: (newValues: Partial<RequiredCertificateType>[]) => void;
}

const RequiredCertificateMultiSelectBase: React.FC<
  RequiredCertificateMultiSelectBaseProps
> = ({ name, placeholder, field, onChange, setCertificates }) => {
  const { data, isLoading, error } = useRequiredCertificates();

  const handleChange = (
    newValues: MultiValue<Partial<RequiredCertificateType>>
  ): void => {
    if (setCertificates) {
      setCertificates(newValues as Partial<RequiredCertificateType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<RequiredCertificateType>[]);
    }
  };

  return (
    <CatalogMultiSelect<Partial<RequiredCertificateType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay certificados disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionValue={(opt: Partial<RequiredCertificateType>) =>
        opt.id ? String(opt.id) : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<RequiredCertificateType>[])
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
    />
  );
};

export default RequiredCertificateMultiSelectBase;
