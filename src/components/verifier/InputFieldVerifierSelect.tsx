import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import VerifierSelectBase from './VerifierSelectBase';
import { VerifierResponse } from '../../types/verifier/verifier.response';

interface InputFieldVerifierSelectProps {
    name: string;
    label: string;
    placeholder: string;
    setVerifier?: (verifier: Partial<VerifierResponse>) => void;
}

const InputFieldVerifierSelect: React.FC<InputFieldVerifierSelectProps> = ({
    name,
    label,
    placeholder,
    setVerifier,
}) => {
    const [field, meta, helpers] = useField(name);

    return (
        <Field.Root id={name} invalid={!!meta.error && meta.touched}>
            <Field.Label fontSize='sm' mb='8px'>
                {label}
            </Field.Label>

            <VerifierSelectBase
                name={name}
                placeholder={placeholder}
                onChange={(newValue) => helpers.setValue(newValue?.id)}
                field={field}
                setVerifier={setVerifier}
            />

            {meta.error && meta.touched && (
                <Field.ErrorText mt='8px' mb='16px'>
                    {meta.error}
                </Field.ErrorText>
            )}
        </Field.Root>
    );
};

export default InputFieldVerifierSelect;
