import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useVerifiers } from '../../hooks/verifier/getVerifiers';
import { VerifierResponse } from '../../types/verifier/verifier.response';

interface VerifierSelectBaseProps {
  name?: string;
  field?: FieldInputProps<unknown>;
  placeholder: string;
  setVerifier?: (verifier: Partial<VerifierResponse>) => void;
  onChange?: (newValue: Partial<VerifierResponse>) => void;
}

const VerifierSelectBase: React.FC<VerifierSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setVerifier,
}) => {
  const { data = [], isLoading, error } = useVerifiers();

  const handleChange = (
    newValue: SingleValue<Partial<VerifierResponse>>
  ): void => {
    if (setVerifier) {
      setVerifier(newValue as Partial<VerifierResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<VerifierResponse>);
    }
  };

  return (
    <CatalogSelect<Partial<VerifierResponse>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'No hay verificadoras disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default VerifierSelectBase;
