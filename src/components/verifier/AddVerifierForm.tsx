'use client';
import { Button, Flex, SimpleGrid, Box, Separator } from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import { FormSectionTitle, FormActions } from '@/components/ui/form/FormSection';
import { useSubmitVerifier } from './hooks/useSubmitVerifier';
import InputFieldText from '../ui/form/InputFieldText';

const AddVerifierForm: React.FC = () => {
    const { onSubmit, initialValues, validationSchema, isLoading } = useSubmitVerifier();

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {({ values }) => (
                <Form>
                    <Flex flexDirection="column" gap={3}>
                        <FormSectionTitle>
                            Verificador
                        </FormSectionTitle>

                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                            <InputFieldText name="name" label="Nombre / Razón Social" placeholder="Ingresa el nombre" />
                            <InputFieldText name="ruc" label="RUC" placeholder="Ingresa el RUC" />
                            <InputFieldText name="address" label="Dirección" placeholder="Ingresa la dirección" />
                        </SimpleGrid>

                        <FormSectionTitle>
                            Contactos
                        </FormSectionTitle>
                        <FieldArray name="contacts">
                            {({ push, remove }) => (
                                <>
                                    {values.contacts.map((_, index) => (
                                        <Box key={index}>
                                            <SimpleGrid columns={{ base: 1, sm: 4 }} gap={5}>
                                                <InputFieldText
                                                    name={`contacts[${index}].name`}
                                                    label="Nombre del Contacto"
                                                    placeholder="Ingresa el nombre"
                                                />
                                                <InputFieldText
                                                    name={`contacts[${index}].email`}
                                                    label="Correo"
                                                    placeholder="Ingresa el correo"
                                                />
                                                <InputFieldText
                                                    name={`contacts[${index}].phone`}
                                                    label="Teléfono"
                                                    placeholder="Ingresa el teléfono"
                                                />
                                                <Flex alignSelf="end">
                                                    <Button
                                                        width="100%"
                                                        variant="solid"
                                                        colorPalette="red"
                                                        disabled={values.contacts.length === 1}
                                                        onClick={() => remove(index)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </Flex>
                                            </SimpleGrid>
                                            <Separator mt="16px" mb="8px" borderWidth="2px" variant="dashed" />
                                        </Box>
                                    ))}
                                    <Button onClick={() => push({ name: '', email: '', phone: '' })} mb="10px">
                                        Agregar Contacto
                                    </Button>
                                </>
                            )}
                        </FieldArray>
                        <FormActions><Button type="submit" colorPalette='green' loading={isLoading}>
                            Agregar Verificador
                        </Button></FormActions>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default AddVerifierForm;
