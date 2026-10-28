import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useInsecticides } from '../../../../hooks/box-brand/additions/insecticide/getInsecticides';
import { InsecticideType } from '../../../../types/box-brand/additions/insecticide';

interface InsecticideSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setInsecticide?: (insecticide: Partial<InsecticideType>) => void;
  onChange?: (newValue: Partial<InsecticideType>) => void;
}

const InsecticideSelectBase: React.FC<InsecticideSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setInsecticide,
  onChange,
}) => {
  const { data = [], isLoading, error } = useInsecticides();

  useEffect(() => {
    if (!!setInsecticide)
      setInsecticide(
        (data as Partial<InsecticideType>[]).find(
          (insecticide) => insecticide.id === field?.value
        ) as Partial<InsecticideType>
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field?.value]);

  const handleChange = (
    newValue: SingleValue<Partial<InsecticideType>>
  ): void => {
    if (setInsecticide) setInsecticide(newValue as Partial<InsecticideType>);
    if (onChange) onChange(newValue as Partial<InsecticideType>);
  };

  return (
    <CatalogSelect<Partial<InsecticideType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay etiqueta/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<InsecticideType>) => opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default InsecticideSelectBase;
