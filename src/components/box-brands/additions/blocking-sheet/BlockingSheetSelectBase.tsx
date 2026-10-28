import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useBlockingSheets } from '../../../../hooks/box-brand/additions/blocking-sheet/getBlockingSheets';
import { BlockingSheetType } from '../../../../types/box-brand/additions/blockingSheet';

interface BlockingSheetSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setBlockingSheet?: (blockingSheet: Partial<BlockingSheetType>) => void;
  onChange?: (newValue: Partial<BlockingSheetType>) => void;
}

const BlockingSheetSelectBase: React.FC<BlockingSheetSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setBlockingSheet,
  onChange,
}) => {
  const { data, isLoading, error } = useBlockingSheets();

  const handleChange = (
    newValue: SingleValue<Partial<BlockingSheetType>>
  ): void => {
    if (setBlockingSheet)
      setBlockingSheet(newValue as Partial<BlockingSheetType>);
    if (onChange) onChange(newValue as Partial<BlockingSheetType>);
  };

  return (
    <CatalogSelect<Partial<BlockingSheetType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay etiqueta/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default BlockingSheetSelectBase;
