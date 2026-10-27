import { IconButton, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import { FaBan } from 'react-icons/fa';
import AddParasealModal from './AddParasealModal';
import ParasealSelectBase from './ParasealSelectBase';
import { useBanChange } from '../../../ui/form/useBanChange';

interface InputFieldParasealSelectProps {
  name: string;
  label: string;
  placeholder: string;
  isBan?: {
    state: boolean;
    setBanState?: () => void;
    firstChange?: boolean;
  };
}

const InputFieldParasealSelect: React.FC<InputFieldParasealSelectProps> = ({
  name,
  label,
  placeholder,
  isBan,
}) => {
  const [field, meta, helpers] = useField(name);

  useBanChange(isBan?.state, () => {
    if (isBan) {
      if (isBan.state) {
        helpers.setValue(undefined);
        if (isBan.firstChange) {
          helpers.setTouched(false);
        }
      } else {
        helpers.setValue(meta.initialValue);
        if (isBan.firstChange) {
          helpers.setTouched(true);
        }
      }
    }
  });

  const banClick = (): void => {
    if (isBan?.setBanState) {
      isBan.setBanState();
    }
  };

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px' h='21px'>
        {label} <AddParasealModal />
        {isBan && (
          <IconButton
            position='relative'
            top='-5px'
            rounded='full'
            ml='5px'
            colorPalette={isBan.state ? 'orange' : 'gray'}
            aria-label='Ban'
            size='xs'
            variant='outline'
            onClick={banClick}
          >
            <FaBan size='20px' />
          </IconButton>
        )}
      </Field.Label>
      <ParasealSelectBase
        name={name}
        placeholder={placeholder}
        isReadOnly={isBan?.state}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
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

export default InputFieldParasealSelect;
