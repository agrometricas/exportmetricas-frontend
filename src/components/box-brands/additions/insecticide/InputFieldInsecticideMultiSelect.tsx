import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddInsecticideModal from './AddInsecticideModal';
import InsecticideMultiSelectBase from './InsecticideMultiSelectBase';
import { InsecticideType } from '../../../../types/box-brand/additions/insecticide';

interface InputFieldInsecticideMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setInsecticides?: (pesticides: Partial<InsecticideType>[]) => void;
}

const InputFieldInsecticideMultiSelect: React.FC<
  InputFieldInsecticideMultiSelectProps
> = ({ name, label, placeholder }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px' h={'21px'}>
        {label} <AddInsecticideModal />
      </Field.Label>

      <InsecticideMultiSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValues) =>
          helpers.setValue(
            newValues.map((item: Partial<InsecticideType>) => item.id)
          )
        }
        field={field}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldInsecticideMultiSelect;
