import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useSecurityKits } from '../../../../hooks/box-brand/additions/security-kit/getSecurityKits';
import { SecurityKitType } from '../../../../types/box-brand/additions/securityKit';

interface SecurityKitSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setSecurityKit?: (securityKit: Partial<SecurityKitType>) => void;
  onChange?: (newValue: Partial<SecurityKitType>) => void;
}

const SecurityKitSelectBase: React.FC<SecurityKitSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setSecurityKit,
  onChange,
}) => {
  const { data = [], isLoading, error } = useSecurityKits();

  useEffect(() => {
    if (!!setSecurityKit)
      setSecurityKit(
        (data as Partial<SecurityKitType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<SecurityKitType>
      );
  }, [field?.value, setSecurityKit, data]);

  const handleChange = (
    newValue: SingleValue<Partial<SecurityKitType>>
  ): void => {
    if (setSecurityKit) {
      setSecurityKit(newValue as Partial<SecurityKitType>);
    }
    if (onChange) {
      onChange(newValue as Partial<SecurityKitType>);
    }
  };

  return (
    <CatalogSelect<Partial<SecurityKitType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay kits de seguridad disponibles'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<SecurityKitType>) => opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default SecurityKitSelectBase;
