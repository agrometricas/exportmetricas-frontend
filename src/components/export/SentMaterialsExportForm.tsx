/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Box, Button, Flex, Heading, Input, SimpleGrid, Text, Separator } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import InputFieldSentInsecticides from './ui/InputFieldSentInsecticides';
import InputFieldSentPesticides from './ui/InputFieldSentPesticides';
import InputFieldSentQuantity from './ui/InputFieldSentQuantity';
import InputFieldSentSheets from './ui/InputFieldSentSheets';
import InputFieldSentStickers from './ui/InputFieldSentStickers';
import { useCreateExportSent } from '../../hooks/export/export-sent/createExportSent';
import { useSuppliesProposal } from '../../hooks/export/export-sent/getSuppliesProposal';
import { PROGRESS_QUERIES } from '../../hooks/export/exportProgress';
import { ExportResponse } from '../../types/export.response';
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

const buildValidationSchema = (boxBrand: any, boxQuantity: number): any => {
  const shape: Record<string, any> = {};

  const pushIfValid = (key: string, value: any): void => {
    if (value !== null && value > 0) {
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
    .min(1, 'Debe de tener al menos un pesticida');
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
  const [initialValuesExport, setInitialValuesExport] = useState<any>({});
  const { createExportSent, isLoading } = useCreateExportSent();
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
          (part: any) => ({
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
        ).map((part: any) => ({
          insecticideId: part.insecticide?.id,
          quantity: proposedQuantity(
            supplies.insecticideSent,
            'insecticideId',
            part.insecticide?.id
          ),
        })),
        stickerSent: (exportSelected.boxBrand?.stickerCocktail ?? []).map(
          (part: any) => ({
            stickerId: part.sticker?.id,
            quantity: proposedQuantity(
              supplies.stickerSent,
              'stickerId',
              part.sticker?.id
            ),
          })
        ),
        sheetSent: (exportSelected.boxBrand?.sheetCocktail ?? []).map(
          (part: any) => ({
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
    values: any,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const { dataReviewed, ...sentMaterialsExportData } = values;
    dataReviewed;
    createExportSent(sentMaterialsExportData, {
      onError: (error: any) => {
        toaster.create({
          title: 'No se pudo guardar',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 5000,
          closable: true,
        });

        if (error?.response?.status === 401) {
          router.push('/api/auth/signout');
        }
      },
      onSuccess: () => {
        toaster.create({
          title: 'Registro de Insumos Enviado con Éxito',
          type: 'success',
          duration: 5000,
          closable: true,
        });
        queryClient.invalidateQueries('exports');
        queryClient.invalidateQueries('exportsSent');
        queryClient.invalidateQueries('exportsSentPending');
        queryClient.invalidateQueries('exportsPending');
        queryClient.invalidateQueries('clientPaymentsPending');
        queryClient.invalidateQueries('cuttingSheets');
        queryClient.invalidateQueries('cuttingSheetsPending');
        queryClient.invalidateQueries('exportSentCostsPending');
        actions.resetForm();
        PROGRESS_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
        router.push(returnTo('/dashboard/liquidation/exports-sent', window.location.search));
      },
    });
  };

  const renderMaterialField = (
    name: keyof typeof initialValuesExport,
    label: string,
    material: any,
    quantity: any,
    unit = 'C/U'
  ): JSX.Element | null => {
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
  const proposedCocktail = (
    cocktail: any[] | undefined,
    lines: { quantity: number }[] | undefined,
    key: string,
    idOf: (part: any) => number | undefined
  ): any[] =>
    (cocktail ?? []).map((part) => ({
      ...part,
      quantity: proposedQuantity(lines as any, key, idOf(part)),
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
          <Heading fontSize='2xl' p='12px'>
            Exportación
          </Heading>
          <Separator mb='16px' />
          <Box p='4' borderWidth='1px' borderRadius='md' borderColor='border'>
            <Text fontSize='sm'>
              <strong>Marca de Caja:</strong> {brand?.name || 'N/A'}
            </Text>
            <Text fontSize='sm'>
              <strong>Código de Marca:</strong> {brand?.brandCode || 'N/A'}
            </Text>
            <Text fontSize='sm'>
              <strong>Peso Neto (Caja):</strong> {brand?.netWeightBox} LBS
            </Text>
            <Text fontSize='sm'>
              <strong>Peso Bruto (Caja):</strong> {brand?.grossWeightBox} LBS
            </Text>
            <Text fontSize='sm'>
              <strong>Marca Principal:</strong> {brand?.brand?.name || 'N/A'}
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
                opacity={0.8} />
            </Box>
            <Box>
              <FormLabel>Contenedores</FormLabel>
              <Input
                value={proposal?.containers ?? ''}
                readOnly
                _hover={{ borderColor: 'border' }}
                cursor='not-allowed'
                textAlign='right'
                opacity={0.8} />
            </Box>
          </SimpleGrid>
          <Text fontSize='sm' color='fg.muted'>
            Las cantidades las propone el sistema: lo que la alícuota pone por
            caja, por las cajas; lo que pone por contenedor, por los
            contenedores; y la fumigación, en proporción a las cajas. Se pueden
            cambiar antes de enviar.
          </Text>
          <Heading fontSize='2xl' p='12px'>
            Materiales para las cajas
          </Heading>
          <Separator mb='16px' />
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
            'Cluster Bag',
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
              <Heading fontSize='2xl' p='12px'>
                Materiales para contenedor
              </Heading>
              <Separator mb='16px' />
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
            'Mini Pallet',
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
              <Heading fontSize='2xl' p='12px'>
                Materiales adicionales
              </Heading>
              <Separator mb='16px' />
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
            'Removedor de Látex',
            brand?.latexRemover,
            supplies?.latexRemoverQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'blockingSheetQuantity',
            'Lámina de Bloque',
            brand?.blockingSheet,
            supplies?.blockingSheetQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'containerSealPlasticQuantity',
            'Plástico de Cierre Contenedor',
            brand?.containerSealPlastic,
            supplies?.containerSealPlasticQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'securityKitQuantity',
            'Kit de Seguridad',
            brand?.securityKit,
            supplies?.securityKitQuantity,
            'U/C'
          )}
          {renderMaterialField(
            'boardingCardQuantity',
            'Tarjeta de Embarque',
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
          <Heading fontSize={'2xl'} p={'12px'}>
            Materiales para post cosecha
          </Heading>
          <Heading fontSize='xl' p='10px'>
            Pesticidas
          </Heading>
          <Separator mb='16px' />
          <InputFieldSentPesticides
            name='pesticideSent'
            pesticideCocktailSelected={pesticideCocktail}
          />
          {brand?.insecticideCocktail &&
            brand.insecticideCocktail.length > 0 && (
              <Box>
                <Heading fontSize='xl' p='10px'>
                  Insecticidas
                </Heading>
                <Separator mb='16px' />
                <InputFieldSentInsecticides
                  name='insecticideSent'
                  insecticideCocktailSelected={insecticideCocktail}
                />
              </Box>
            )}
          <CheckboxForm
            name='dataReviewed'
            label='He revisado los datos agregados'
          />
          <Button
            mt='12px'
            type='submit'
            colorPalette='green'
            loading={isLoading}
          >
            Enviar
          </Button>
        </Flex>
      </Form>
    </Formik>
  );
};

export default SentMaterialsExportForm;
