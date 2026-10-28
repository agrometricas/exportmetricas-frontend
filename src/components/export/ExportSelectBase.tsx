import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { ExportType } from '@/types/export';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useExportsPending } from '../../hooks/export/getExportsPending';

interface ExportSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setExport?: (exportSelected: Partial<ExportType>) => void;
  onChange?: (newValue: Partial<ExportType>) => void;
}

const ExportSelectBase: React.FC<ExportSelectBaseProps> = ({
  name,
  field,
  placeholder,
  onChange,
  setExport,
}) => {
  const { data, isLoading, error } = useExportsPending();

  const handleChange = (newValue: SingleValue<Partial<ExportType>>): void => {
    if (setExport) {
      setExport(newValue as Partial<ExportType>);
    }
    if (onChange) {
      onChange(newValue as Partial<ExportType>);
    }
  };

  return (
    <CatalogSelect<Partial<ExportType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay exportacion/es pendiente/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<ExportType>) => `${opt.id}`}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<ExportType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default ExportSelectBase;
