import {
  Input,
  InputGroup,
  IconButton,
  Text,
  Flex,
  Field,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { useEffect, useRef } from 'react';
import { FaBan } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

interface InputFieldProps {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  isDisabledRemove?: boolean;
  isReadOnly?: boolean;
  flexDirection?: 'column' | 'row';
  alignItems?: 'flex-start' | 'flex-end';
  isBan?: {
    state: boolean;
    setBanState?: () => void;
    firstChange?: boolean;
  };
  onClickRemove?: () => void;
  unit?: string;
}

const InputFieldText: React.FC<InputFieldProps> = ({
  name,
  label,
  defaultValue,
  placeholder,
  isDisabledRemove,
  isReadOnly,
  flexDirection = 'column',
  isBan,
  onClickRemove,
  unit,
}) => {
  const [field, meta, helpers] = useField(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (meta.error && meta.touched) {
      inputRef.current?.focus();
    }
  }, [meta.error, meta.touched]);

  useEffect(() => {
    if (!!isBan) {
      inputRef.current?.blur();
      if (isBan?.state) {
        field.value = 'N/A';
        helpers.setValue('N/A');
        if (isBan.firstChange) {
          helpers.setTouched(false);
        }
      } else {
        field.value = '';
        helpers.setValue(meta.initialValue);
        if (isBan.firstChange) {
          helpers.setTouched(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBan?.state]);

  useEffect(() => {
    if (!!defaultValue) {
      helpers.setValue(defaultValue);
      field.value = defaultValue;
    } else {
      helpers.setValue('');
      field.value = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const banClick = (): void => {
    if (isBan?.setBanState) {
      isBan.setBanState();
    }
  };

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched} width={'100%'}>
      <Flex
        flexDirection={flexDirection}
        alignItems={flexDirection === 'row' ? 'center' : 'flex-start'}
      >
        {label && (
          <Flex
            flex={flexDirection === 'row' ? '1' : 'none'}
            minWidth={flexDirection === 'row' ? '15%' : '100%'}
            maxWidth={flexDirection === 'row' ? '25%' : '100%'}
            alignItems='center'
            marginRight={flexDirection === 'row' ? '2%' : '0'}
          >
            <Field.Label
              fontSize='sm'
              m={0}
              mb={flexDirection === 'column' ? '8px' : '0'}
              textAlign={flexDirection === 'row' ? 'left' : 'center'}
              overflow='hidden'
            >
              <Text display='flex' alignItems='center'>
                {label}{' '}
                {!!isBan && (
                  <IconButton
                    rounded='full'
                    ml={'5px'}
                    colorPalette={!!isBan.state ? 'orange' : 'gray'}
                    aria-label='Ban'
                    size='sm'
                    variant='outline'
                    onClick={banClick}
                  >
                    <FaBan size='16px' />
                  </IconButton>
                )}
              </Text>
            </Field.Label>
          </Flex>
        )}
        <Flex
          flex={label ? '2' : '1'}
          width='100%'
          marginLeft={label ? '0' : '0'}
        >
          <InputGroup
            endElement={
              onClickRemove ? (
                <IconButton
                  variant='ghost'
                  colorPalette='red'
                  aria-label='Eliminar'
                  size='sm'
                  disabled={isDisabledRemove}
                  onClick={onClickRemove}
                >
                  <TiDelete />
                </IconButton>
              ) : (
                unit
              )
            }
            endElementProps={
              onClickRemove
                ? { pointerEvents: 'auto', pe: '1' }
                : { color: 'fg.muted', mr: '16px' }
            }
          >
            <Input
              {...field}
              ref={inputRef}
              readOnly={isBan?.state || isReadOnly}
              placeholder={placeholder || label}
            />
          </InputGroup>
        </Flex>
      </Flex>
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldText;
