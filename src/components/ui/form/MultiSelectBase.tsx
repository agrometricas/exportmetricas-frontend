/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
    Select as ChakraSelect,
    ChakraStylesConfig,
    GroupBase,
    MultiValue,
    CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';

export interface Option {
    value: string;
    label: string;
}

interface MultiSelectBaseProps {
    name?: string;
    field: FieldInputProps<any>;
    placeholder: string;
    options: Option[];
    onChange: (newValues: Option[]) => void;
}

const chakraStyles: ChakraStylesConfig<Option, true, GroupBase<Option>> = {
    container: (provided) => ({
        ...provided,
        w: 'full',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'gray.600',
    }),
    input: (provided) => ({
        ...provided,
        color: 'gray.900',
    }),
    option: (provided) => ({
        ...provided,
        borderBottom: '1px solid',
        borderColor: 'gray.200',
    }),
};

const MultiSelectBase: React.FC<MultiSelectBaseProps> = ({
    name,
    field,
    placeholder,
    options,
    onChange,
}) => {
    const handleChange = (newValues: MultiValue<Option>): void => {
        onChange(newValues as Option[]);
    };

    return (
        <ChakraSelect
            {...field}
            name={name}
            isMulti
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (provided) =>
                    ({ ...provided, zIndex: 100 } as CSSObjectWithLabel),
            }}

            chakraStyles={chakraStyles}
            options={options}
            getOptionLabel={(opt: Option) => opt.label}
            getOptionValue={(opt: Option) => opt.value}
            onChange={handleChange}
            value={
                field?.value
                    ? options.filter((opt) => field.value.indexOf(opt.value) >= 0)
                    : []
            }
            closeMenuOnSelect={false}
            placeholder={placeholder}
        />
    );
};

export default MultiSelectBase;
