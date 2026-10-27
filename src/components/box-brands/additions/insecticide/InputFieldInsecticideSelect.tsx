import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddInsecticideModal from './AddInsecticideModal';
import InsecticideSelectBase from './InsecticideSelectBase';
import { InsecticideType } from '../../../../types/box-brand/additions/insecticide';

interface InputFieldInsecticideSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setInsecticide?: (insecticide: Partial<InsecticideType>) => void;
}

const InputFieldInsecticideSelect: React.FC<
  InputFieldInsecticideSelectProps
> = ({ name, label, placeholder, setInsecticide }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px' h={'21px'}>
        {label} <AddInsecticideModal />
      </Field.Label>

      <InsecticideSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setInsecticide={setInsecticide}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldInsecticideSelect;
