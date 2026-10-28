import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useSheets } from '../../../../hooks/box-brand/additions/sheet/getSheets';
import { SheetType } from '../../../../types/box-brand/additions/sheet';

interface SheetSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setSheet?: (sheet: Partial<SheetType>) => void;
  onChange?: (newValue: Partial<SheetType>) => void;
}

const SheetSelectBase: React.FC<SheetSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setSheet,
  onChange,
}) => {
  const { data = [], isLoading, error } = useSheets();

  useEffect(() => {
    if (!!setSheet)
      setSheet(
        (data as Partial<SheetType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<SheetType>
      );
  }, [field?.value, setSheet, data]);

  const handleChange = (newValue: SingleValue<Partial<SheetType>>): void => {
    if (setSheet) {
      setSheet(newValue as Partial<SheetType>);
    }
    if (onChange) {
      onChange(newValue as Partial<SheetType>);
    }
  };

  return (
    <CatalogSelect<Partial<SheetType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay hojas disponibles'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<SheetType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default SheetSelectBase;
