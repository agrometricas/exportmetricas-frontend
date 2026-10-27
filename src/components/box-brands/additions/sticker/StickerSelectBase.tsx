/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  SingleValue,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useStickers } from '../../../../hooks/box-brand/additions/sticker/getStickers';
import { StickerType } from '../../../../types/box-brand/additions/sticker';

interface StickerSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setSticker?: (sticker: Partial<StickerType>) => void;
  onChange?: (newValue: Partial<StickerType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<StickerType>,
  false,
  GroupBase<Partial<StickerType>>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'fg.muted',
  }),
  input: (provided) => ({
    ...provided,
    color: 'fg.heading',
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'border',
  }),
};

const pesticideComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<StickerType>,
      false,
      GroupBase<Partial<StickerType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const StickerSelectBase: React.FC<StickerSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setSticker,
  onChange,
}) => {
  const { data = [], isLoading, error } = useStickers();

  useEffect(() => {
    if (!!setSticker)
      setSticker(
        (data as Partial<StickerType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<StickerType>
      );
  }, [field?.value, setSticker, data]);

  const handleChange = (newValue: SingleValue<Partial<StickerType>>): void => {
    if (setSticker) {
      setSticker(newValue as Partial<StickerType>);
    }
    if (onChange) {
      onChange(newValue as Partial<StickerType>);
    }
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (provided) =>
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay stickers disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<StickerType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<StickerType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<StickerType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
      components={pesticideComponents}
    />
  );
};

export default StickerSelectBase;
