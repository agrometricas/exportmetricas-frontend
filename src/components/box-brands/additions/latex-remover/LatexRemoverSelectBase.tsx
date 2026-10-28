import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useLatexRemovers } from '../../../../hooks/box-brand/additions/latex-remover/getLatexRemovers';
import { LatexRemoverType } from '../../../../types/box-brand/additions/latexRemover';

interface LatexRemoverSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setLatexRemover?: (latexRemover: Partial<LatexRemoverType>) => void;
  onChange?: (newValue: Partial<LatexRemoverType>) => void;
}

const LatexRemoverSelectBase: React.FC<LatexRemoverSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setLatexRemover,
  onChange,
}) => {
  const { data, isLoading, error } = useLatexRemovers();

  const handleChange = (
    newValue: SingleValue<Partial<LatexRemoverType>>
  ): void => {
    if (setLatexRemover) setLatexRemover(newValue as Partial<LatexRemoverType>);
    if (onChange) onChange(newValue as Partial<LatexRemoverType>);
  };

  return (
    <CatalogSelect<Partial<LatexRemoverType>>
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

export default LatexRemoverSelectBase;
