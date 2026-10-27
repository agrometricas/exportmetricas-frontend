import { Input, Field } from '@chakra-ui/react';
import React from 'react';

interface DisplayFieldProps {
    label: string;
    value: string | undefined;
}

const DisplayField: React.FC<DisplayFieldProps> = ({ label, value }) => {
    return (
        <Field.Root>
            <Field.Label fontSize="sm" mb={1}>
                {label}
            </Field.Label>
            <Input value={value || ''} readOnly />
        </Field.Root>
    );
};

export default DisplayField;
