import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddPesticideModal from './AddPesticideModal';
import PesticideSelectBase from './PesticideSelectBase';
import { PesticideType } from '../../../../types/box-brand/post-harvest/pesticide';

interface InputFieldPesticideSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setPesticide?: (pesticide: Partial<PesticideType>) => void;
}

const InputFieldPesticideSelect: React.FC<InputFieldPesticideSelectProps> = ({
  name,
  label,
  placeholder,
  setPesticide,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px' h={'21px'}>
        {label} <AddPesticideModal />
      </Field.Label>

      <PesticideSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setPesticide={setPesticide}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldPesticideSelect;
