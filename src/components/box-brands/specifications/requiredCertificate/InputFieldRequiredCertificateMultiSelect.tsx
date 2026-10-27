import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddCertificateModal from './AddRequiredCertificateModal';
import RequiredCertificateMultiSelectBase from './RequiredCertificateMultiSelectBase';
import { RequiredCertificateType } from '../../../../types/box-brand/specifications/requiredCertificate';

interface InputFieldRequiredCertificateMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setCertificates?: (certificates: Partial<RequiredCertificateType>[]) => void;
}

const InputFieldRequiredCertificateMultiSelect: React.FC<
  InputFieldRequiredCertificateMultiSelectProps
> = ({ name, label, placeholder, setCertificates }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label} <AddCertificateModal />
      </Field.Label>

      <RequiredCertificateMultiSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValues) =>
          helpers.setValue(
            newValues.map((item: Partial<RequiredCertificateType>) => item.id)
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

export default InputFieldRequiredCertificateMultiSelect;
