import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useEffect, useRef } from 'react';
import BusinessSelectBase from './BusinessSelectBase';
import { BusinessType } from '../../types/merchant/business';

interface InputFieldBusinessSelectProps {
  name: string;
  label: string;
  placeholder: string;
  merchant?: number;
  setBusiness?: (producer: Partial<BusinessType>) => void;
}

const InputFieldBusinessSelect: React.FC<InputFieldBusinessSelectProps> = ({
  name,
  label,
  placeholder,
  merchant,
  setBusiness,
}) => {
  const [field, meta, helpers] = useField(name);
  const previousMerchant = useRef(merchant);

  // Only a change of producer invalidates the farm: on mount the value may
  // come prefilled from an export being edited or duplicated.
  useEffect(() => {
    if (previousMerchant.current === merchant) return;
    previousMerchant.current = merchant;
    helpers.setValue(null);
  }, [helpers, merchant]);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <BusinessSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setBusiness={setBusiness}
        merchant={merchant}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldBusinessSelect;
