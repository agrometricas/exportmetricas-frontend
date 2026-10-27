import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddCertificateModal from './AddCertificateModal';
import CertificateMultiSelectBase from './CertificateMultiSelectBase';
import { Certificate } from '../../types/utils/certificate';

interface InputFieldCertificateMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setCertificates?: (certificates: Partial<Certificate>[]) => void;
}

const InputFieldCertificateMultiSelect: React.FC<
  InputFieldCertificateMultiSelectProps
> = ({ name, label, placeholder, setCertificates }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label} <AddCertificateModal />
      </Field.Label>

      <CertificateMultiSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValues) =>
          helpers.setValue(
            newValues.map((item: Partial<Certificate>) => item.id)
          )
        }
        field={field}
        setCertificates={setCertificates}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldCertificateMultiSelect;
