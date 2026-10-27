import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddStickerModal from './AddStickerModal';
import StickerSelectBase from './StickerSelectBase';
import { StickerType } from '../../../../types/box-brand/additions/sticker';

interface InputFieldStickerSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setSticker?: (pesticide: Partial<StickerType>) => void;
}

const InputFieldStickerSelect: React.FC<InputFieldStickerSelectProps> = ({
  name,
  label,
  placeholder,
  setSticker,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px' h={'21px'}>
        {label} <AddStickerModal />
      </Field.Label>

      <StickerSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setSticker={setSticker}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldStickerSelect;
