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
import { useBoardingCards } from '../../../../hooks/box-brand/additions/boarding-card/getBoardingCards';
import { BoardingCardType } from '../../../../types/box-brand/additions/boardingCard';

interface BoardingCardSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setBoardingCard?: (boardingCard: Partial<BoardingCardType>) => void;
  onChange?: (newValue: Partial<BoardingCardType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<BoardingCardType>,
  false,
  GroupBase<Partial<BoardingCardType>>
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
      Partial<BoardingCardType>,
      false,
      GroupBase<Partial<BoardingCardType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const BoardingCardSelectBase: React.FC<BoardingCardSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setBoardingCard,
  onChange,
}) => {
  const { data = [], isLoading, error } = useBoardingCards();

  useEffect(() => {
    if (!!setBoardingCard)
      setBoardingCard(
        (data as Partial<BoardingCardType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<BoardingCardType>
      );
  }, [field?.value, setBoardingCard, data]);

  const handleChange = (
    newValue: SingleValue<Partial<BoardingCardType>>
  ): void => {
    if (setBoardingCard) {
      setBoardingCard(newValue as Partial<BoardingCardType>);
    }
    if (onChange) {
      onChange(newValue as Partial<BoardingCardType>);
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
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay tarjetas de embarque disponibles'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<BoardingCardType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<BoardingCardType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<BoardingCardType>) => opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
      components={pesticideComponents}
    />
  );
};

export default BoardingCardSelectBase;
