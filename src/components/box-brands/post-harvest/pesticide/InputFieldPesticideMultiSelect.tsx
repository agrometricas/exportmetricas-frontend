import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddPesticideModal from './AddPesticideModal';
import PesticideMultiSelectBase from './PesticideMultiSelectBase';
import { PesticideType } from '../../../../types/box-brand/post-harvest/pesticide';

interface InputFieldPesticideMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setPesticides?: (pesticides: Partial<PesticideType>[]) => void;
}

const InputFieldPesticideMultiSelect: React.FC<
  InputFieldPesticideMultiSelectProps
> = ({ name, label, placeholder, setPesticides }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label} <AddPesticideModal />
      </Field.Label>

      <PesticideMultiSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValues) =>
          helpers.setValue(
            newValues.map((item: Partial<PesticideType>) => item.id)
          )
        }
        field={field}
        setPesticides={setPesticides}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldPesticideMultiSelect;
