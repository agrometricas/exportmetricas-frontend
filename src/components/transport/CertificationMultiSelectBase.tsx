/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
    ChakraStylesConfig,
    DropdownIndicatorProps,
    Select as ChakraSelect,
    GroupBase,
    chakraComponents,
    MultiValue,
    CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useCertifications } from '../../hooks/utils/getCertifications';

export interface Certification {
    id: number;
    name: string;
}

interface CertificationMultiSelectBaseProps {
    name?: string;
    field?: FieldInputProps<any>;
    placeholder: string;
    setCertifications?: (certificates: Partial<Certification>[]) => void;
    onChange?: (newValues: Partial<Certification>[]) => void;
}

const chakraStyles: ChakraStylesConfig<
    Partial<Certification>,
    true,
    GroupBase<Partial<Certification>>
> = {
    container: (provided) => ({
        ...provided,
        w: 'full',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'fg.muted',
    }),
    input: (provided) => ({
        ...provided,
        color: 'fg.heading',
    }),
    option: (provided) => ({
        ...provided,
        borderBottom: '1px solid',
        borderColor: 'border',
    }),
};

const certificateComponents = {
    DropdownIndicator: (
        props: DropdownIndicatorProps<
            Partial<Certification>,
            true,
            GroupBase<Partial<Certification>>
        >
    ): React.JSX.Element => (
        <chakraComponents.DropdownIndicator {...props}>
            <Icon boxSize='13px' asChild><MdOutlineArrowDropDownCircle /></Icon>
        </chakraComponents.DropdownIndicator>
    ),
};

const CertificationMultiSelectBase: React.FC<
    CertificationMultiSelectBaseProps
> = ({ name, placeholder, field, onChange, setCertifications }) => {
    const { data, isLoading, error } = useCertifications();
    const router = useRouter();

    useEffect(() => {
        if (!!error) {
            const { response } = error as any;
            const { data } = response;
            const { statusCode } = data;

            if (statusCode === 401) {
                router.push('/api/auth/signout');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const handleChange = (
        newValues: MultiValue<Partial<Certification>>
    ): void => {
        if (setCertifications) {
            setCertifications(newValues as Partial<Certification>[]);
        }

        if (onChange) {
            onChange(newValues as Partial<Certification>[]);
        }
    };

    return (
        <ChakraSelect
            {...field}
            name={name}
            isMulti
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (provided) =>
                    (({
                        ...provided,
                        zIndex: 100,
                    }) as CSSObjectWithLabel),
            }}

            chakraStyles={chakraStyles}
            noOptionsMessage={() =>
                !!error
                    ? (error as any).response.data.message
                    : 'Ya no hay certificados disponibles'
            }
            isLoading={isLoading}
            options={data}
            getOptionLabel={(opt: Partial<Certification>) => `${opt.name}`}
            getOptionValue={(opt: Partial<Certification>) =>
                opt.id ? String(opt.id) : ''
            }
            onChange={(newValues) =>
                handleChange(newValues as Partial<Certification>[])
            }
            value={
                field?.value
                    ? data?.filter(
                        (opt: Partial<Certification>) =>
                            field.value.indexOf(opt.id) >= 0
                    )
                    : []
            }
            closeMenuOnSelect={false}
            placeholder={placeholder}
            components={certificateComponents}
        />
    );
};

export default CertificationMultiSelectBase;
