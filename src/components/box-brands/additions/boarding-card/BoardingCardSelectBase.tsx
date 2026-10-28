import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
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
    <CatalogSelect<Partial<BoardingCardType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay tarjetas de embarque disponibles'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<BoardingCardType>) => opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default BoardingCardSelectBase;
