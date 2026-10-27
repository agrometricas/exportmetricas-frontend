import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import IncotermMultiSelectBase, { IncotermType } from './IncotermMultiSelectBase';

interface InputFieldIncotermMultiSelectProps {
    name: string;
    label: string;
    placeholder: string;
    setIncoterms?: (incoterms: Partial<IncotermType>[]) => void;
}

const InputFieldIncotermMultiSelect: React.FC<
    InputFieldIncotermMultiSelectProps
> = ({ name, label, placeholder, setIncoterms }) => {
    const [field, meta, helpers] = useField(name);

    return (
        <Field.Root id={name} invalid={!!meta.error && meta.touched}>
            <Field.Label fontSize='sm' mb='8px'>
                {label}
            </Field.Label>

            <IncotermMultiSelectBase
                name={name}
                placeholder={placeholder}
                onChange={(newValues) =>
                    helpers.setValue(
                        newValues.map((item: Partial<IncotermType>) => item.id)
                    )
                }
                field={field}
                setIncoterms={setIncoterms}
            />

            {meta.error && meta.touched && (
                <Field.ErrorText mt='8px' mb='16px'>
                    {meta.error}
                </Field.ErrorText>
            )}
        </Field.Root>
    );
};

export default InputFieldIncotermMultiSelect;
