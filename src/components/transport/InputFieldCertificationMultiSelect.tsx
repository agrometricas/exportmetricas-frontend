import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import CertificationMultiSelectBase from './CertificationMultiSelectBase';

export interface Certification {
  id: number;
  name: string;
}

interface InputFieldCertificationMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setCertifications?: (certificates: Partial<Certification>[]) => void;
}

const InputFieldCertificationMultiSelect: React.FC<
  InputFieldCertificationMultiSelectProps
> = ({ name, label, placeholder, setCertifications }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <CertificationMultiSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValues) =>
          helpers.setValue(
            newValues.map((item: Partial<Certification>) => item.id)
          )
        }
        field={field}
        setCertifications={setCertifications}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldCertificationMultiSelect;
