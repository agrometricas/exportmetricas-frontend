'use client';

import { Box, Button, Flex, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  FormSectionTitle,
  FormSubsectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { qk } from '@/lib/queryKeys';
import InputFieldSentInsecticides from './ui/InputFieldSentInsecticides';
import InputFieldSentPesticides from './ui/InputFieldSentPesticides';
import InputFieldSentQuantity from './ui/InputFieldSentQuantity';
import InputFieldSentSheets from './ui/InputFieldSentSheets';
import InputFieldSentStickers from './ui/InputFieldSentStickers';
import { useCreateExportSent } from '../../hooks/export/export-sent/createExportSent';
import { useSuppliesProposal } from '../../hooks/export/export-sent/getSuppliesProposal';
import { PROGRESS_QUERIES } from '../../hooks/export/exportProgress';
import { BoxBrandResponse, ExportResponse } from '../../types/export.response';
import { SuppliesProposal } from '../../types/suppliesProposal';
import { returnTo } from '../../utils/exportSteps';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import { proposedQuantity } from '../../utils/suppliesProposal';
import CheckboxForm from '../ui/form/CheckboxForm';
import { FormLabel } from '../ui/form/FormLabel';

const pesticideSchema = Yup.object().shape({
  quantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
});

const insecticideSchema = Yup.object().shape({
  quantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
});

const stickerSchema = Yup.object().shape({
  quantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
});

const sheetSchema = Yup.object().shape({
  quantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
});

const buildValidationSchema = (
  boxBrand: BoxBrandResponse | undefined,
  boxQuantity: number
): Yup.AnyObjectSchema => {
  const shape: Record<string, Yup.AnySchema> = {};

  const pushIfValid = (key: string, value: number | null | undefined): void => {
    if (value != null && value > 0) {
      shape[key] = Yup.number()
        .integer('Debe ser un número entero')
        .min(1, 'Debe ser mayor que 0')
        .required('Requerido');
    }
  };

  pushIfValid('bottomTypeQuantity', boxQuantity);
  pushIfValid('lidTypeQuantity', boxQuantity);
  pushIfValid('coverTypeQuantity', boxQuantity);
  pushIfValid('cardboardTypeQuantity', boxQuantity);

  if (boxBrand) {
    pushIfValid('parasealTypeQuantity', boxBrand.parasealTypeQuantity);
    pushIfValid('padTypeQuantity', boxBrand.padTypeQuantity);
    pushIfValid('spongeTypeQuantity', boxBrand.spongeTypeQuantity);
    pushIfValid('labelQuantity', boxBrand.labelQuantity);
    pushIfValid('bandQuantity', boxBrand.bandQuantity);
    pushIfValid('sachetQuantity', boxBrand.sachetQuantity);
    pushIfValid('rubberQuantity', boxBrand.rubberQuantity);
    pushIfValid('protectorQuantity', boxBrand.protectorQuantity);
    pushIfValid('clusterBagQuantity', boxBrand.clusterBagQuantity);
    pushIfValid('palletsTypeQuantity', boxBrand.palletsTypeQuantity);
    pushIfValid('miniPalletsTypeQuantity', boxBrand.miniPalletsTypeQuantity);
    pushIfValid('cornerTypeQuantity', boxBrand.cornerTypeQuantity);
    pushIfValid(
      'reinforcementTypeQuantity',
      boxBrand.reinforcementTypeQuantity
    );
    pushIfValid('stapleQuantity', boxBrand.stapleQuantity);
    pushIfValid('strippingQuantity', boxBrand.strippingQuantity);
    pushIfValid('thermographQuantity', boxBrand.thermographQuantity);
    pushIfValid('sealQuantity', boxBrand.sealQuantity);
    pushIfValid('mettoLabelQuantity', boxBrand.mettoLabelQuantity);
    pushIfValid('packingTapeTypeQuantity', boxBrand.packingTapeTypeQuantity);
    pushIfValid('latexRemoverQuantity', boxBrand.latexRemoverQuantity);
    pushIfValid('blockingSheetQuantity', boxBrand.blockingSheetQuantity);
    pushIfValid(
      'containerSealPlasticQuantity',
      boxBrand.containerSealPlasticQuantity
    );
    pushIfValid('securityKitQuantity', boxBrand.securityKitQuantity);
    pushIfValid('boardingCardQuantity', boxBrand.boardingCardQuantity);
  }

  shape.pesticideSent = Yup.array()
    .of(pesticideSchema)
    .min(1, 'Debe tener al menos un pesticida');
  shape.insecticideSent = Yup.array().of(insecticideSchema);
  shape.stickerSent = Yup.array().of(stickerSchema);
  shape.sheetSent = Yup.array().of(sheetSchema);
  shape.dataReviewed = Yup.boolean()
    .oneOf([true], 'Debes revisar los datos antes de enviar')
    .required();

  return Yup.object().shape(shape);
};

const SentMaterialsExportForm = ({
  exportSelected,
}: {
  exportSelected: Partial<ExportResponse>;
  pathname: string;
}): React.JSX.Element => {
  const [initialValuesExport, setInitialValuesExport] = useState<
    Record<string, unknown>
  >({});
  const { createExportSent, isPending: isLoading } = useCreateExportSent();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: proposalData } = useSuppliesProposal(exportSelected?.id);
  const proposal = proposalData as SuppliesProposal | undefined;
  const supplies = proposal?.supplies;

  useEffect(() => {
    if (exportSelected?.id && supplies) {
      setInitialValuesExport({
        exportId: exportSelected.id,
        ...supplies,
        pesticideSent: (exportSelected.boxBrand?.pesticideCocktail ?? []).map(
          (part) => ({
            pesticideId: part.pesticide?.id,
            quantity: proposedQuantity(
              supplies.pesticideSent,
              'pesticideId',
              part.pesticide?.id
            ),
          })
        ),
        insecticideSent: (
          exportSelected.boxBrand?.insecticideCocktail ?? []
        ).map((part) => ({
          insecticideId: part.insecticide?.id,
          quantity: proposedQuantity(
            supplies.insecticideSent,
            'insecticideId',
            part.insecticide?.id
          ),
        })),
        stickerSent: (exportSelected.boxBrand?.stickerCocktail ?? []).map(
          (part) => ({
            stickerId: part.sticker?.id,
            quantity: proposedQuantity(
              supplies.stickerSent,
              'stickerId',
              part.sticker?.id
            ),
          })
        ),
        sheetSent: (exportSelected.boxBrand?.sheetCocktail ?? []).map(
          (part) => ({
            sheetId: part.sheet?.id,
            quantity: proposedQuantity(
              supplies.sheetSent,
              'sheetId',
              part.sheet?.id
            ),
          })
        ),
        dataReviewed: false,
      });
    }
  }, [exportSelected, supplies]);

  const sentMaterialsExport = async (
    values: Record<string, unknown>,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const { dataReviewed, ...sentMaterialsExportData } = values;
    void dataReviewed;
    createExportSent(sentMaterialsExportData, {
      onError: (error) => {
        toaster.create({
          title: 'No se pudo guardar',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 5000,
          closable: true,
        });
      },
      onSuccess: () => {
        toaster.create({
          title: 'Registro de insumos enviado con éxito',
          type: 'success',
          duration: 5000,
          closable: true,
        });
        queryClient.invalidateQueries({
          queryKey: qk('exports'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('exportsSent'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('exportsSentPending'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('exportsPending'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('clientPaymentsPending'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('cuttingSheets'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('cuttingSheetsPending'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('exportSentCostsPending'),
        });
        actions.resetForm();
        PROGRESS_QUERIES.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: qk(key) })
        );
        router.push(
          returnTo(
            '/dashboard/liquidation/exports-sent',
            window.location.search
          )
        );
      },
    });
  };

  const renderMaterialField = (
    name: string,
    label: string,
    material: { name?: string } | null | undefined,
    quantity: number | string | null | undefined,
    unit = 'C/U'
  ): React.JSX.Element | null => {
    if (!material || !quantity || Number(quantity) <= 0) return null;

    return (
      <InputFieldSentQuantity
        key={String(name)}
        name={String(name)}
        material={label}
        materialSelected={material.name || 'N/A'}
        quantity={Number(quantity)}
        unit={unit}
      />
    );
  };

  const brand = exportSelected?.boxBrand;
  const quantity = exportSelected?.boxQuantity || 0;
  const proposedCocktail = <T extends object, K extends string>(
    cocktail: T[] | undefined,
    lines: ({ quantity: number } & Record<K, number>)[] | undefined,
    key: K,
    idOf: (part: T) => number | '' | undefined
  ): (T & { quantity: number | '' })[] =>
    (cocktail ?? []).map((part) => ({
      ...part,
      quantity: proposedQuantity(lines, key, idOf(part)),
    }));
  const pesticideCocktail = proposedCocktail(
    brand?.pesticideCocktail,
    supplies?.pesticideSent,
    'pesticideId',
    (part) => part.pesticide?.id
  );
  const insecticideCocktail = proposedCocktail(
    brand?.insecticideCocktail,
    supplies?.insecticideSent,
    'insecticideId',
    (part) => part.insecticide?.id
  );
  const stickerCocktail = proposedCocktail(
    brand?.stickerCocktail,
    supplies?.stickerSent,
    'stickerId',
    (part) => part.sticker?.id
  );
  const sheetCocktail = proposedCocktail(
    brand?.sheetCocktail,
    supplies?.sheetSent,
    'sheetId',
    (part) => part.sheet?.id
  );

  return (
    <Formik
      initialValues={initialValuesExport}
      enableReinitialize
      validationSchema={buildValidationSchema(brand, quantity)}
      onSubmit={sentMaterialsExport}
    >
      <Form>
        <Flex flexDirection='column' gap={3}>
          <FormSectionTitle>Exportación</FormSectionTitle>
          <Box p='4' borderWidth='1px' borderRadius='md' borderColor='border'>
            <Text fontSize='sm'>
              <strong>Marca de caja:</strong> {brand?.name || 'N/A'}
            </Text>
            <Text fontSize='sm'>
              <strong>Código de marca:</strong> {brand?.brandCode || 'N/A'}
            </Text>
            <Text fontSize='sm'>
              <strong>Peso neto (caja):</strong> {brand?.netWeightBox} LBS
            </Text>
            <Text fontSize='sm'>
              <strong>Peso bruto (caja):</strong> {brand?.grossWeightBox} LBS
            </Text>
            <Text fontSize='sm'>
              <strong>Marca principal:</strong> {brand?.brand?.name || 'N/A'}
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt='16px'>
            <Box>
              <FormLabel>Cantidad de cajas</FormLabel>
              <Input
                value={quantity}
                readOnly
                _hover={{ borderColor: 'border' }}
                cursor='not-allowed'
                textAlign='right'
                opacity={0.8}
              />
            </Box>
            <Box>
              <FormLabel>Contenedores</FormLabel>
              <Input
                value={proposal?.containers ?? ''}
                readOnly
                _hover={{ borderColor: 'border' }}
                cursor='not-allowed'
                textAlign='right'
                opacity={0.8}
              />
            </Box>
          </SimpleGrid>
          <Text fontSize='sm' color='fg.muted'>
            Las cantidades las propone el sistema: lo que la alícuota pone por
            caja, por las cajas; lo que pone por contenedor, por los
            contenedores; y la fumigación, en proporción a las cajas. Se pueden
            cambiar antes de enviar.
          </Text>
          <FormSectionTitle>Materiales para las cajas</FormSectionTitle>
          {renderMaterialField(
            'bottomTypeQuantity',
            'Fondo',
            brand?.bottomType,
            supplies?.bottomTypeQuantity
          )}
          {renderMaterialField(
            'lidTypeQuantity',
            'Tapa',
            brand?.lidType,
            supplies?.lidTypeQuantity
          )}
          {renderMaterialField(
            'coverTypeQuantity',
            'Funda',
            brand?.coverType,
            supplies?.coverTypeQuantity
          )}
          {renderMaterialField(
            'cardboardTypeQuantity',
            'Cartulina',
            brand?.cardboardType,
            supplies?.cardboardTypeQuantity
          )}
          {renderMaterialField(
            'parasealTypeQuantity',
            'ParaSeal',
            brand?.parasealType,
            supplies?.parasealTypeQuantity
          )}
          {renderMaterialField(
            'padTypeQuantity',
            'Pad',
            brand?.padType,
            supplies?.padTypeQuantity
          )}
          {renderMaterialField(
            'spongeTypeQuantity',
            'Esponja',
            brand?.spongeType,
            supplies?.spongeTypeQuantity
          )}
          {renderMaterialField(
            'labelQuantity',
            'Etiqueta',
            brand?.label,
            supplies?.labelQuantity
          )}
          {renderMaterialField(
            'bandQuantity',
            'Banda',
            brand?.band,
            supplies?.bandQuantity
          )}
          {renderMaterialField(
            'sachetQuantity',
            'Sachet',
            brand?.sachet,
            supplies?.sachetQuantity
          )}
          {renderMaterialField(
            'rubberQuantity',
            'Liga',
            brand?.rubber,
            supplies?.rubberQuantity
          )}
          {renderMaterialField(
            'protectorQuantity',
            'Protector',
            brand?.protector,
            supplies?.protectorQuantity
          )}
          {renderMaterialField(
            'clusterBagQuantity',
            'Cluster bag',
            brand?.clusterBag,
            supplies?.clusterBagQuantity
          )}
          {!!(
            brand?.palletsTypeQuantity ||
            brand?.miniPalletsTypeQuantity ||
            brand?.cornerTypeQuantity ||
            brand?.reinforcementTypeQuantity ||
            brand?.stapleQuantity ||
            brand?.strippingQuantity ||
            brand?.thermographQuantity ||
            brand?.sealQuantity ||
            brand?.mettoLabelQuantity
          ) && (
            <>
              <FormSectionTitle>Materiales para contenedor</FormSectionTitle>
            </>
          )}
          {renderMaterialField(
            'palletsTypeQuantity',
            'Pallet',
            brand?.palletsType,
            supplies?.palletsTypeQuantity,
            'C/C'
          )}
          {renderMaterialField(
            'miniPalletsTypeQuantity',
            'Mini pallet',
            brand?.miniPalletsType,
            supplies?.miniPalletsTypeQuantity,
            'C/C'
          )}
          {renderMaterialField(
            'cornerTypeQuantity',
            'Esquinero',
            brand?.cornerType,
            supplies?.cornerTypeQuantity,
            'C/C'
          )}
          {renderMaterialField(
            'reinforcementTypeQuantity',
            'Refuerzo',
            brand?.reinforcementType,
            supplies?.reinforcementTypeQuantity,
            'C/C'
          )}
          {renderMaterialField(
            'stapleQuantity',
            'Grapa',
            brand?.staple,
            supplies?.stapleQuantity,
            'C/C'
          )}
          {renderMaterialField(
            'strippingQuantity',
            'Zuncho',
            brand?.stripping,
            supplies?.strippingQuantity,
            'C/C'
          )}
          {renderMaterialField(
            'thermographQuantity',
            'Termógrafo',
            brand?.thermograph,
            supplies?.thermographQuantity,
            'C/C'
          )}
          {renderMaterialField(
            'sealQuantity',
            'Sello',
            brand?.seal,
            supplies?.sealQuantity,
            'C/C'
          )}
          {renderMaterialField(
            'mettoLabelQuantity',
            'Etiqueta Metto',
            brand?.mettoLabel,
            supplies?.mettoLabelQuantity,
            'C/C'
          )}
          {!!(
            brand?.packingTapeTypeQuantity ||
            brand?.latexRemoverQuantity ||
            brand?.blockingSheetQuantity
          ) && (
            <>
              <FormSectionTitle>Materiales adicionales</FormSectionTitle>
            </>
          )}
          {renderMaterialField(
            'packingTapeTypeQuantity',
            'Cinta de embalaje',
            brand?.packingTapeType,
            supplies?.packingTapeTypeQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'latexRemoverQuantity',
            'Removedor de látex',
            brand?.latexRemover,
            supplies?.latexRemoverQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'blockingSheetQuantity',
            'Lámina de bloque',
            brand?.blockingSheet,
            supplies?.blockingSheetQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'containerSealPlasticQuantity',
            'Plástico de cierre contenedor',
            brand?.containerSealPlastic,
            supplies?.containerSealPlasticQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'securityKitQuantity',
            'Kit de seguridad',
            brand?.securityKit,
            supplies?.securityKitQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'boardingCardQuantity',
            'Tarjeta de embarque',
            brand?.boardingCard,
            supplies?.boardingCardQuantity,
            'U/C'
          )}
          {brand?.stickerCocktail && brand.stickerCocktail.length > 0 && (
            <InputFieldSentStickers
              name='stickerSent'
              stickerCocktailSelected={stickerCocktail}
              unit='U/C'
            />
          )}
          {brand?.sheetCocktail && brand.sheetCocktail.length > 0 && (
            <InputFieldSentSheets
              name='sheetSent'
              sheetCocktailSelected={sheetCocktail}
              unit='U/C'
            />
          )}
          <FormSectionTitle>Materiales para post cosecha</FormSectionTitle>
          <FormSubsectionTitle>Pesticidas</FormSubsectionTitle>
          <InputFieldSentPesticides
            name='pesticideSent'
            pesticideCocktailSelected={pesticideCocktail}
          />
          {brand?.insecticideCocktail &&
            brand.insecticideCocktail.length > 0 && (
              <Box>
                <FormSubsectionTitle>Insecticidas</FormSubsectionTitle>
                <InputFieldSentInsecticides
                  name='insecticideSent'
                  insecticideCocktailSelected={insecticideCocktail}
                />
              </Box>
            )}
          <FormActions
            start={
              <CheckboxForm
                name='dataReviewed'
                label='He revisado los datos agregados'
              />
            }
          >
            <Button type='submit' colorPalette='green' loading={isLoading}>
              Registrar envío
            </Button>
          </FormActions>
        </Flex>
      </Form>
    </Formik>
  );
};

export default SentMaterialsExportForm;
