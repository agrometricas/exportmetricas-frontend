import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import ExportSelectBase from './ExportSelectBase';
import { ExportType } from '../../types/export';

interface InputFieldExportSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setExport?: (exportSelected: Partial<ExportType>) => void;
}

const InputFieldExportSelect: React.FC<InputFieldExportSelectProps> = ({
  name,
  label,
  placeholder,
  setExport,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <ExportSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setExport={setExport}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldExportSelect;
