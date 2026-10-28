import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useBoxBrands } from '@/hooks/box-brand/getBoxBrands';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { BoxBrandType } from '../../types/box-brand/boxBrand';

interface BoxBrandSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setBoxBrand?: (brand: Partial<BoxBrandType>) => void;
  onChange?: (newValue: Partial<BoxBrandType>) => void;
}

const BoxBrandSelectBase: React.FC<BoxBrandSelectBaseProps> = ({
  setBoxBrand,
  onChange,
  field,
  placeholder,
  name,
}) => {
  const { data = [], isLoading, error } = useBoxBrands();
  const onlyOption: Partial<BoxBrandType> | null =
    data.length === 1 ? data[0] : null;

  const handleChange = (newValue: SingleValue<Partial<BoxBrandType>>): void => {
    if (setBoxBrand) {
      setBoxBrand(newValue as Partial<BoxBrandType>);
    }
    if (onChange) {
      onChange(newValue as Partial<BoxBrandType>);
    }
  };

  useEffect(() => {
    if (field && !field.value && onlyOption) handleChange(onlyOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyOption, field?.value]);

  return (
    <CatalogSelect<Partial<BoxBrandType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay tipo/s de caja disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<BoxBrandType>) =>
        `${opt.brand?.name} - ${opt.name}`
      }
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default BoxBrandSelectBase;
