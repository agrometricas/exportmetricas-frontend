import { Box, Text } from '@chakra-ui/react';
import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useCertificates } from '../../hooks/utils/getCertificates';
import { Certificate } from '../../types/utils/certificate';

interface CertificateMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number[]>;
  placeholder: string;
  setCertificates?: (certificates: Partial<Certificate>[]) => void;
  onChange?: (newValues: Partial<Certificate>[]) => void;
}

const CertificateMultiSelectBase: React.FC<CertificateMultiSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setCertificates,
}) => {
  const { data, isLoading, error } = useCertificates();
  const handleChange = (newValues: MultiValue<Partial<Certificate>>): void => {
    if (setCertificates) {
      setCertificates(newValues as Partial<Certificate>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<Certificate>[]);
    }
  };

  return (
    <CatalogMultiSelect<Partial<Certificate>>
      field={field}
      instanceId={name}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay certificados disponibles'
      }
      isLoading={isLoading}
      options={data}
      formatOptionLabel={(opt: Partial<Certificate>, { context }) =>
        context === 'menu' && opt.description ? (
          <Box>
            <Text>{opt.name}</Text>
            <Text fontSize='xs' color='fg.muted'>
              {opt.description}
            </Text>
          </Box>
        ) : (
          opt.name
        )
      }
      getOptionValue={(opt: Partial<Certificate>) =>
        opt.id ? String(opt.id) : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<Certificate>[])
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
    />
  );
};

export default CertificateMultiSelectBase;
