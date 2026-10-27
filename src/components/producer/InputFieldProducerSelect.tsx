import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import ProducerSelectBase from './ProducerSelectBase';
import { MerchantResponse } from '../../types/merchant/merchant.response';

interface InputFieldProducerSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setProducer?: (producer: Partial<MerchantResponse>) => void;
}

const InputFieldProducerSelect: React.FC<InputFieldProducerSelectProps> = ({
  name,
  label,
  placeholder,
  setProducer,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <ProducerSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setProducer={setProducer}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldProducerSelect;
