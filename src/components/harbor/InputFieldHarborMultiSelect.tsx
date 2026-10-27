import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import HarborMultiSelectBase from './HarborMultiSelectBase';
import { HarborType } from '../../types/harbor';

interface InputFieldHarborMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  type: string | 'Nacional' | 'Internacional';
  setHarbors?: (harbors: Partial<HarborType>[]) => void;
}

const InputFieldHarborMultiSelect: React.FC<
  InputFieldHarborMultiSelectProps
> = ({ name, label, placeholder, type, setHarbors }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <HarborMultiSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValues) =>
          helpers.setValue(
            newValues.map((item: Partial<HarborType>) => item.id)
          )
        }
        field={field}
        setHarbors={setHarbors}
        type={type}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldHarborMultiSelect;
