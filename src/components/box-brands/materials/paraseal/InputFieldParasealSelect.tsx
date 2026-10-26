import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
} from '@chakra-ui/react';
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
    <FormControl id={name} isInvalid={!!meta.error && meta.touched}>
      <FormLabel fontSize='sm' mb='8px' h='21px'>
        {label} <AddParasealModal />
        {isBan && (
          <IconButton
            position='relative'
            top='-5px'
            isRound
            ml='5px'
            colorScheme={isBan.state ? 'orange' : 'gray'}
            aria-label='Ban'
            size='base'
            variant='outline'
            icon={<FaBan size='20px' />}
            onClick={banClick}
          />
        )}
      </FormLabel>
      <ParasealSelectBase
        name={name}
        placeholder={placeholder}
        isReadOnly={isBan?.state}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
      />
      {meta.error && meta.touched && (
        <FormErrorMessage mt='8px' mb='16px'>
          {meta.error}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default InputFieldParasealSelect;
