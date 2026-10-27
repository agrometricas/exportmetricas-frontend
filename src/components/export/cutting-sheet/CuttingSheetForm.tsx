'use client';
import { Box, Button, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import DisplayField from './DisplayField';
import ReadOnlyDateGrid from './ReadOnlyDateGrid';
import { useCreateCuttingSheet } from '../../../hooks/export/cuttingSheet/createCuttingSheet';
import { PROGRESS_QUERIES } from '../../../hooks/export/exportProgress';
import { CuttingSheetType } from '../../../types/cuttingSheet';
import { ExportResponse } from '../../../types/export.response';
import { ExportSentType } from '../../../types/exportSent';
import {
  belowDeckFor,
  boxBrandHasPallets,
  CONTAINER_POSITIONS,
  palletsHeightOptions,
} from '../../../utils/cuttingSheetOptions';
import {
  formatDayMonthYear,
  formatDayMonthYearTime,
} from '../../../utils/dayMonthYear';
import { returnTo } from '../../../utils/exportSteps';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import CheckboxForm from '../../ui/form/CheckboxForm';
import InputFieldSelector from '../../ui/form/InputFieldSelector';
import InputFieldText from '../../ui/form/InputFieldText';
import UnsavedChangesGuard from '../../ui/form/UnsavedChangesGuard';
import SelectCuttingType from '../cutting-type/SelectCuttingType';

const emptyExportData: ExportResponse = {
  id: 0,
  boxQuantity: 0,
  boxBrand: {
    id: 0,
    name: '',
    brandCode: '',
    netWeightBox: 0,
    grossWeightBox: 0,
    boxQuantity: 0,
    brand: { id: 0, name: '' },
    bottomType: { id: 0, name: '', code: '', exporterId: 0 },
    bottomTypeQuantity: 0,
    lidType: { id: 0, name: '', code: '', exporterId: 0 },
    lidTypeQuantity: 0,
    coverType: { id: 0, name: '', code: '', exporterId: 0 },
    coverTypeQuantity: 0,
    cardboardType: { id: 0, name: '', code: '', exporterId: 0 },
    cardboardTypeQuantity: 0,
    parasealType: { id: 0, name: '', code: '', exporterId: 0 },
    parasealTypeQuantity: 0,
    padType: { id: 0, name: '', code: '', exporterId: 0 },
    padTypeQuantity: 0,
    spongeType: { id: 0, name: '', code: '', exporterId: 0 },
    spongeTypeQuantity: 0,
    label: { id: 0, name: '' },
    labelQuantity: 0,
    band: { id: 0, name: '' },
    bandQuantity: 0,
    sachet: { id: 0, name: '' },
    sachetQuantity: 0,
    rubber: { id: 0, name: '' },
    rubberQuantity: 0,
    protector: { id: 0, name: '' },
    protectorQuantity: 0,
    clusterBag: { id: 0, name: '' },
    clusterBagQuantity: 0,
    pesticideCocktail: [],
    palletsType: { id: 0, name: '', code: '', exporterId: 0 },
    palletsTypeQuantity: 0,
    miniPalletsType: { id: 0, name: '', code: '', exporterId: 0 },
    miniPalletsTypeQuantity: 0,
    cornerType: { id: 0, name: '', code: '', exporterId: 0 },
    cornerTypeQuantity: 0,
    reinforcementType: { id: 0, name: '', code: '', exporterId: 0 },
    reinforcementTypeQuantity: 0,
    staple: { id: 0, name: '' },
    stapleQuantity: 0,
    stripping: { id: 0, name: '' },
    strippingQuantity: 0,
    thermograph: { id: 0, name: '' },
    thermographQuantity: 0,
    seal: { id: 0, name: '' },
    sealQuantity: 0,
    mettoLabel: { id: 0, name: '' },
    mettoLabelQuantity: 0,
    packingTapeType: { id: 0, name: '', code: '', exporterId: 0 },
    packingTapeTypeQuantity: 0,
    latexRemover: { id: 0, name: '' },
    latexRemoverQuantity: 0,
    insecticideCocktail: [],
    blockingSheet: { id: 0, name: '' },
    blockingSheetQuantity: 0,
    stickerCocktail: [],
    sheetCocktail: [],
    containerSealPlastic: { id: 0, name: '' },
    containerSealPlasticQuantity: 0,
    securityKit: { id: 0, name: '' },
    securityKitQuantity: 0,
    boardingCard: { id: 0, name: '' },
    boardingCardQuantity: 0,
  },
  merchant: {
    id: 0,
    businessName: '',
    businessId: '',
    city: { id: 0, name: '', code: '', provinceId: 0 },
    address: '',
  },
  business: {
    id: 0,
    name: '',
    address: '',
    area: 0,
    city: { id: 0, name: '', code: '', provinceId: 0 },
    latitude: null,
    longitude: null,
    contacts: [],
  },
  harborDeparture: {
    id: 0,
    name: '',
    country: { id: 0, name: '', code: '' },
    city: { id: 0, name: '', code: '', provinceId: 0 },
    latitude: null,
    longitude: null,
  },
  harborDestination: {
    id: 0,
    name: '',
    code: '',
    country: { id: 0, name: '', code: '', region: '' },
    city: { id: 0, name: '', code: '', provinceId: 0 },
    latitude: null,
    longitude: null,
  },
  client: {
    id: 0,
    businessName: '',
    businessId: '',
    commercialType: '',
    email: '',
    phone: '',
    certificates: {
      certificate: {
        id: 0,
        name: '',
        certificateCode: '',
      },
    },
  },
  exportSent: {
    id: 0,
  },
  pendingExportSent: false,
  cuttingDate: '',
  weekDescription: '',
  weekDaysOfWeek: ['', '', '', '', '', '', ''],
  weekBoxesOfDay: [0, 0, 0, 0, 0, 0, 0],
  weekTotal: 0,
  shipName: '',
  estimatedTravelTime: '',
  bookingNumber: '',
  shippingDateTime: '',
  numberOfVerifiers: 0,
  contractType: '',
  cancelledAt: null,
  cancellationReason: null,
  shippingCompany: { id: 0, name: '', code: '', contacts: [] },
  deposit: {
    id: 0,
    name: '',
    code: '',
    address: '',
    city: { id: 0, name: '' },
    contacts: [],
  },
  transport: {
    id: 0,
    name: '',
    ruc: '',
    address: '',
    satelliteTracking: false,
    contacts: [],
  },
  verifier: { id: 0, name: '', ruc: '', address: '', contacts: [] },
};

interface FinalFormValues {
  exportData: ExportResponse;
  cuttingTypeId: string;
  palletsHeight: string;
  containerPositioning: string;
  belowDeck: string;
  dataReviewed: boolean;
}

const initialFinalFormValues: FinalFormValues = {
  exportData: emptyExportData,
  cuttingTypeId: '',
  palletsHeight: '',
  containerPositioning: '',
  belowDeck: '',
  dataReviewed: false,
};

const mapExportToFormValues = (
  exportData: Partial<ExportResponse>
): FinalFormValues => {
  return {
    exportData: {
      ...emptyExportData,
      ...exportData,
      boxBrand: {
        ...emptyExportData.boxBrand,
        ...exportData.boxBrand,
        brand: {
          ...emptyExportData.boxBrand.brand,
          ...exportData.boxBrand?.brand,
        },
      },
      merchant: {
        ...emptyExportData.merchant,
        ...exportData.merchant,
        city: {
          ...emptyExportData.merchant.city,
          ...exportData.merchant?.city,
        },
      },
      business: {
        ...emptyExportData.business,
        ...exportData.business,
        city: {
          ...emptyExportData.business.city,
          ...exportData.business?.city,
        },
      },
      harborDeparture: {
        ...emptyExportData.harborDeparture,
        ...exportData.harborDeparture,
      },
      harborDestination: {
        ...emptyExportData.harborDestination,
        ...exportData.harborDestination,
      },
      shippingCompany: {
        ...emptyExportData.shippingCompany,
        ...exportData.shippingCompany,
      },
      deposit: {
        ...emptyExportData.deposit,
        ...exportData.deposit,
      },
      transport: {
        ...emptyExportData.transport,
        ...exportData.transport,
      },
      verifier: {
        ...emptyExportData.verifier,
        ...exportData.verifier,
      },
    },
    cuttingTypeId: '',
    palletsHeight: '',
    containerPositioning: '',
    belowDeck: '',
    dataReviewed: false,
  };
};

const finalValidationSchema = Yup.object({
  exportData: Yup.mixed().required('Datos de exportación requeridos'),
  cuttingTypeId: Yup.number()
    .typeError('El tipo de corte debe ser un número')
    .required('Tipo de corte es requerido'),
  palletsHeight: Yup.string().required('Altura de palets es requerida'),
  containerPositioning: Yup.string().required(
    'Posición del contenedor es requerida'
  ),
  belowDeck: Yup.string().required('Bajo cubierta es requerido'),
  dataReviewed: Yup.boolean()
    .oneOf([true], 'Debes revisar los datos antes de enviar')
    .required('Requerido'),
});

interface CuttingSheetFormProps {
  cuttingSheetSelected: Partial<ExportResponse>;
  exportSentSelected: Partial<ExportSentType>;
}

const renderQuantityField = (
  label: string,
  value?: number | '' | null
): React.JSX.Element | null => {
  const validNumber = typeof value === 'number' && value > 0;
  return validNumber ? (
    <DisplayField label={label} value={value.toString()} />
  ) : null;
};

const renderNameField = (
  label: string,
  value?: string
): React.JSX.Element | null => {
  return value && value.trim() !== '' ? (
    <DisplayField label={label} value={value} />
  ) : null;
};

const CuttingSheetForm = ({
  cuttingSheetSelected,
  exportSentSelected,
}: CuttingSheetFormProps): React.JSX.Element => {
  const [finalValues, setFinalValues] = useState<FinalFormValues>(
    initialFinalFormValues
  );

  const { createCuttingSheet, isPending: isLoading } = useCreateCuttingSheet();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (cuttingSheetSelected) {
      setFinalValues(mapExportToFormValues(cuttingSheetSelected));
    }
  }, [cuttingSheetSelected]);

  const handleSubmit = async (
    values: FinalFormValues,
    formikHelpers: FormikHelpers<FinalFormValues>
  ): Promise<void> => {
    const payload: CuttingSheetType = {
      exportSentId: exportSentSelected.id,
      cuttingTypeId: Number(values.cuttingTypeId),
      palletsHeight: values.palletsHeight,
      containerPositioning: values.containerPositioning,
      belowDeck: values.belowDeck,
    };

    createCuttingSheet(payload, {
      onError: (error) => {
        toaster.create({
          title: 'No se creó la hoja de corte',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 5000,
          closable: true,
        });
      },
      onSuccess: (response) => {
        toaster.create({
          title: 'Registro y PDF creados exitosamente',
          type: 'success',
          duration: 10000,
          closable: true,
          action: {
            label: 'Abrir PDF',
            onClick: () => window.open(response.pdfUrl, '_blank'),
          },
        });
        queryClient.invalidateQueries({
          queryKey: ['cuttingSheets'],
        });
        queryClient.invalidateQueries({
          queryKey: ['cuttingSheetsPending'],
        });
        formikHelpers.resetForm();
        PROGRESS_QUERIES.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: [key] })
        );
        router.push(
          returnTo('/dashboard/export/cutting-sheets', window.location.search)
        );
      },
    });
  };
  const palletsOptions = palletsHeightOptions(
    boxBrandHasPallets(finalValues.exportData.boxBrand)
  );

  return (
    <Box>
      <Box>
        <FormSectionTitle>Información de la exportación</FormSectionTitle>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
          <DisplayField
            label='Cantidad de cajas'
            value={finalValues.exportData?.boxQuantity.toString()}
          />
          <DisplayField
            label='Envío de insumos pendiente'
            value={finalValues.exportData?.pendingExportSent ? 'Sí' : 'No'}
          />
          <DisplayField
            label='Fecha de corte'
            value={formatDayMonthYear(finalValues.exportData.cuttingDate)}
          />
          <DisplayField
            label='Descripción de la semana'
            value={finalValues.exportData.weekDescription}
          />
        </SimpleGrid>
        <ReadOnlyDateGrid
          weekDaysOfWeek={finalValues.exportData.weekDaysOfWeek}
          weekBoxesOfDay={finalValues.exportData.weekBoxesOfDay}
          weekTotal={finalValues.exportData.weekTotal}
        />

        <FormSectionTitle>Información de envío</FormSectionTitle>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2' pb={4}>
          <DisplayField
            label='Nombre de la nave'
            value={finalValues.exportData?.shipName}
          />
          <DisplayField
            label='Tiempo estimado de viaje'
            value={finalValues.exportData?.estimatedTravelTime}
          />
          <DisplayField
            label='Número de booking'
            value={finalValues.exportData?.bookingNumber}
          />
          <DisplayField
            label='Fecha máxima de ingreso'
            value={formatDayMonthYearTime(
              finalValues.exportData?.shippingDateTime
            )}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2' pb={4}>
          <DisplayField
            label='Puerto de salida'
            value={finalValues.exportData?.harborDeparture?.name}
          />
          <DisplayField
            label='País'
            value={finalValues.exportData?.harborDeparture?.country?.name}
          />
          <DisplayField
            label='Ciudad'
            value={finalValues.exportData?.harborDeparture?.city?.name}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2' pb={4}>
          <DisplayField
            label='Puerto de llegada'
            value={finalValues.exportData?.harborDestination?.name}
          />
          <DisplayField
            label='País'
            value={finalValues.exportData?.harborDestination?.country?.name}
          />
          <DisplayField
            label='Ciudad'
            value={finalValues.exportData?.harborDestination?.city?.name}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2' pb={4}>
          <DisplayField
            label='Naviera'
            value={finalValues.exportData?.shippingCompany?.name}
          />
          <DisplayField
            label='Código'
            value={finalValues.exportData?.shippingCompany.code}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2' pb={4}>
          <DisplayField
            label='Depósito'
            value={finalValues.exportData?.deposit?.name}
          />
          <DisplayField
            label='Dirección'
            value={finalValues.exportData?.deposit.address}
          />
          <DisplayField
            label='Ciudad'
            value={finalValues.exportData?.deposit?.city?.name}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2' pb={4}>
          <DisplayField
            label='Transporte'
            value={finalValues.exportData?.transport?.name}
          />
          <DisplayField
            label='RUC'
            value={finalValues.exportData?.transport.ruc}
          />
          <DisplayField
            label='Dirección'
            value={finalValues.exportData?.transport.address}
          />
          <DisplayField
            label='Tracking satelital'
            value={
              finalValues.exportData?.transport.satelliteTracking ? 'Sí' : 'No'
            }
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2' pb={4}>
          <DisplayField
            label='Verificadora'
            value={finalValues.exportData?.verifier?.name}
          />
          <DisplayField
            label='RUC'
            value={finalValues.exportData?.verifier.ruc}
          />
          <DisplayField
            label='Dirección'
            value={finalValues.exportData?.verifier.address}
          />
          <DisplayField
            label='Número de verificadores'
            value={finalValues.exportData?.numberOfVerifiers.toString()}
          />
        </SimpleGrid>
        <FormSectionTitle>Información del cliente</FormSectionTitle>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
          <DisplayField
            label='Nombre'
            value={finalValues.exportData?.client.businessName}
          />
          <DisplayField
            label='RUC'
            value={finalValues.exportData?.client.businessId}
          />
          <DisplayField
            label='Tipo comercial'
            value={finalValues.exportData?.client.commercialType}
          />
          <DisplayField
            label='Email'
            value={finalValues.exportData?.client.email}
          />
          <DisplayField
            label='Teléfono'
            value={finalValues.exportData?.client.phone}
          />
        </SimpleGrid>
        <FormSectionTitle>Información del productor</FormSectionTitle>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
          <DisplayField
            label='Nombre'
            value={finalValues.exportData?.merchant.businessName}
          />
          <DisplayField
            label='RUC'
            value={finalValues.exportData?.merchant.businessId}
          />
          <DisplayField
            label='Ciudad'
            value={finalValues.exportData?.merchant?.city?.name}
          />
          <DisplayField
            label='Dirección'
            value={finalValues.exportData?.merchant.address}
          />
        </SimpleGrid>
        <FormSectionTitle>Información de la finca</FormSectionTitle>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
          <DisplayField
            label='Nombre'
            value={finalValues.exportData?.business?.name}
          />
          <DisplayField
            label='Área'
            value={finalValues.exportData?.business.area.toString()}
          />
          <DisplayField
            label='Ciudad'
            value={finalValues.exportData?.business?.city?.name}
          />
          <DisplayField
            label='Dirección'
            value={finalValues.exportData?.business.address}
          />
        </SimpleGrid>
        <FormSectionTitle>Marca de caja y embalaje</FormSectionTitle>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
          <DisplayField
            label='Marca'
            value={finalValues.exportData?.boxBrand?.name || ''}
          />
          <DisplayField
            label='Marca de caja'
            value={finalValues.exportData?.boxBrand?.brand?.name || ''}
          />
          <DisplayField
            label='Código de marca'
            value={finalValues.exportData?.boxBrand?.brandCode || ''}
          />
          <DisplayField
            label='Tipo de contrato'
            value={finalValues.exportData?.contractType || ''}
          />
          <DisplayField
            label='Peso neto'
            value={
              finalValues.exportData?.boxBrand?.netWeightBox?.toString() ||
              'N/A'
            }
          />
          <DisplayField
            label='Peso bruto'
            value={
              finalValues.exportData?.boxBrand?.grossWeightBox?.toString() ||
              'N/A'
            }
          />
        </SimpleGrid>

        {(exportSentSelected?.bottomTypeQuantity ||
          exportSentSelected?.lidTypeQuantity ||
          exportSentSelected?.coverTypeQuantity ||
          exportSentSelected?.cardboardTypeQuantity ||
          exportSentSelected?.parasealTypeQuantity ||
          exportSentSelected?.padTypeQuantity ||
          exportSentSelected?.spongeTypeQuantity ||
          exportSentSelected?.labelQuantity ||
          exportSentSelected?.bandQuantity ||
          exportSentSelected?.sachetQuantity ||
          exportSentSelected?.rubberQuantity ||
          exportSentSelected?.protectorQuantity ||
          exportSentSelected?.clusterBagQuantity) && (
          <>
            <Heading size='sm' mt='4' mb='2'>
              Materiales de caja
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
              {renderNameField(
                'Fondo',
                finalValues.exportData.boxBrand.bottomType?.name
              )}
              {renderQuantityField(
                'Cant. Fondo',
                exportSentSelected?.bottomTypeQuantity
              )}

              {renderNameField(
                'Tapa',
                finalValues.exportData.boxBrand.lidType?.name
              )}
              {renderQuantityField(
                'Cant. Tapa',
                exportSentSelected?.lidTypeQuantity
              )}

              {renderNameField(
                'Funda',
                finalValues.exportData.boxBrand.coverType?.name
              )}
              {renderQuantityField(
                'Cant. Funda',
                exportSentSelected?.coverTypeQuantity
              )}

              {renderNameField(
                'Cartulina',
                finalValues.exportData.boxBrand.cardboardType?.name
              )}
              {renderQuantityField(
                'Cant. Cartulina',
                exportSentSelected?.cardboardTypeQuantity
              )}

              {renderNameField(
                'ParaSeal',
                finalValues.exportData.boxBrand.parasealType?.name
              )}
              {renderQuantityField(
                'Cant. ParaSeal',
                exportSentSelected?.parasealTypeQuantity
              )}

              {renderNameField(
                'Pad',
                finalValues.exportData.boxBrand.padType?.name
              )}
              {renderQuantityField(
                'Cant. Pad',
                exportSentSelected?.padTypeQuantity
              )}

              {renderNameField(
                'Esponja',
                finalValues.exportData.boxBrand.spongeType?.name
              )}
              {renderQuantityField(
                'Cant. Esponja',
                exportSentSelected?.spongeTypeQuantity
              )}

              {renderNameField(
                'Etiqueta',
                finalValues.exportData.boxBrand.label?.name
              )}
              {renderQuantityField(
                'Cant. Etiqueta',
                exportSentSelected?.labelQuantity
              )}

              {renderNameField(
                'Banda',
                finalValues.exportData.boxBrand.band?.name
              )}
              {renderQuantityField(
                'Cant. Banda',
                exportSentSelected?.bandQuantity
              )}

              {renderNameField(
                'Sachet',
                finalValues.exportData.boxBrand.sachet?.name
              )}
              {renderQuantityField(
                'Cant. Sachet',
                exportSentSelected?.sachetQuantity
              )}

              {renderNameField(
                'Liga',
                finalValues.exportData.boxBrand.rubber?.name
              )}
              {renderQuantityField(
                'Cant. Liga',
                exportSentSelected?.rubberQuantity
              )}

              {renderNameField(
                'Protector',
                finalValues.exportData.boxBrand.protector?.name
              )}
              {renderQuantityField(
                'Cant. Protector',
                exportSentSelected?.protectorQuantity
              )}

              {renderNameField(
                'Cluster bag',
                finalValues.exportData.boxBrand.clusterBag?.name
              )}
              {renderQuantityField(
                'Cant. Cluster Bag',
                exportSentSelected?.clusterBagQuantity
              )}
            </SimpleGrid>
          </>
        )}

        {[
          exportSentSelected?.palletsTypeQuantity,
          exportSentSelected?.miniPalletsTypeQuantity,
          exportSentSelected?.cornerTypeQuantity,
          exportSentSelected?.reinforcementTypeQuantity,
          exportSentSelected?.stapleQuantity,
          exportSentSelected?.strippingQuantity,
          exportSentSelected?.thermographQuantity,
          exportSentSelected?.sealQuantity,
          exportSentSelected?.mettoLabelQuantity,
        ].some((v) => typeof v === 'number' && v > 0) && (
          <>
            <Heading size='sm' mt='4' mb='2'>
              Materiales por contenedor
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
              {renderNameField(
                'Pallets',
                finalValues.exportData?.boxBrand?.palletsType?.name
              )}
              {renderQuantityField(
                'Cant. Pallets',
                exportSentSelected?.palletsTypeQuantity
              )}

              {renderNameField(
                'Mini pallets',
                finalValues.exportData?.boxBrand?.miniPalletsType?.name
              )}
              {renderQuantityField(
                'Cant. Mini Pallets',
                exportSentSelected?.miniPalletsTypeQuantity
              )}

              {renderNameField(
                'Esquinero',
                finalValues.exportData?.boxBrand?.cornerType?.name
              )}
              {renderQuantityField(
                'Cant. Esquinero',
                exportSentSelected?.cornerTypeQuantity
              )}

              {renderNameField(
                'Refuerzo',
                finalValues.exportData?.boxBrand?.reinforcementType?.name
              )}
              {renderQuantityField(
                'Cant. Refuerzo',
                exportSentSelected?.reinforcementTypeQuantity
              )}

              {renderNameField(
                'Grapa',
                finalValues.exportData?.boxBrand?.staple?.name
              )}
              {renderQuantityField(
                'Cant. Grapa',
                exportSentSelected?.stapleQuantity
              )}

              {renderNameField(
                'Zuncho',
                finalValues.exportData?.boxBrand?.stripping?.name
              )}
              {renderQuantityField(
                'Cant. Zuncho',
                exportSentSelected?.strippingQuantity
              )}

              {renderNameField(
                'Termógrafo',
                finalValues.exportData?.boxBrand?.thermograph?.name
              )}
              {renderQuantityField(
                'Cant. Termógrafo',
                exportSentSelected?.thermographQuantity
              )}

              {renderNameField(
                'Sello',
                finalValues.exportData?.boxBrand?.seal?.name
              )}
              {renderQuantityField(
                'Cant. Sello',
                exportSentSelected?.sealQuantity
              )}

              {renderNameField(
                'Etiqueta Metto',
                finalValues.exportData?.boxBrand?.mettoLabel?.name
              )}
              {renderQuantityField(
                'Cant. Etiqueta Metto',
                exportSentSelected?.mettoLabelQuantity
              )}
            </SimpleGrid>
          </>
        )}

        {[
          exportSentSelected?.packingTapeTypeQuantity,
          exportSentSelected?.latexRemoverQuantity,
          exportSentSelected?.blockingSheetQuantity,
          exportSentSelected?.containerSealPlasticQuantity,
          exportSentSelected?.securityKitQuantity,
          exportSentSelected?.boardingCardQuantity,
        ].some((v) => typeof v === 'number' && v > 0) && (
          <>
            <Heading size='sm' mt='4' mb='2'>
              Adicionales
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
              {renderNameField(
                'Cinta',
                finalValues.exportData?.boxBrand?.packingTapeType?.name
              )}
              {renderQuantityField(
                'Cant. Cinta',
                exportSentSelected?.packingTapeTypeQuantity
              )}

              {renderNameField(
                'Removedor',
                finalValues.exportData?.boxBrand?.latexRemover?.name
              )}
              {renderQuantityField(
                'Cant. Removedor',
                exportSentSelected?.latexRemoverQuantity
              )}

              {renderNameField(
                'Lámina',
                finalValues.exportData?.boxBrand?.blockingSheet?.name
              )}
              {renderQuantityField(
                'Cant. Lámina',
                exportSentSelected?.blockingSheetQuantity
              )}

              {renderNameField(
                'Plástico de cierre contenedor',
                finalValues.exportData?.boxBrand?.containerSealPlastic?.name
              )}
              {renderQuantityField(
                'Cant. Plástico de Cierre Contenedor',
                exportSentSelected?.containerSealPlasticQuantity
              )}
              {renderNameField(
                'Kit de seguridad',
                finalValues.exportData?.boxBrand?.securityKit?.name
              )}
              {renderQuantityField(
                'Cant. Kit de Seguridad',
                exportSentSelected?.securityKitQuantity
              )}
              {renderNameField(
                'Tarjeta de embarque',
                finalValues.exportData?.boxBrand?.boardingCard?.name
              )}
              {renderQuantityField(
                'Cant. Tarjeta de Embarque',
                exportSentSelected?.boardingCardQuantity
              )}
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap='2' mt='2'>
              {exportSentSelected?.stickerSent?.map((item, index) => (
                <DisplayField
                  key={index}
                  label={`Sticker ${index + 1}`}
                  value={`${item?.sticker?.name} (Cant: ${item.quantity})`}
                />
              ))}
              {exportSentSelected?.sheetSent?.map((item, index) => (
                <DisplayField
                  key={index}
                  label={`Hoja ${index + 1}`}
                  value={`${item?.sheet?.name} (Cant: ${item.quantity})`}
                />
              ))}
            </SimpleGrid>
          </>
        )}

        <Heading size='sm' mt='4' mb='2'>
          Insumos post cosecha{' '}
        </Heading>
        <Heading size='sm' mt='4' mb='2'>
          Cóctel de pesticidas
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
          {exportSentSelected?.pesticideSent?.map((item, index) => (
            <DisplayField
              key={index}
              label={`Pesticida ${index + 1}`}
              value={`${item?.pesticide?.name} (Cant: ${item.quantity})`}
            />
          ))}
        </SimpleGrid>
        {Array.isArray(exportSentSelected?.insecticideSent) &&
          exportSentSelected.insecticideSent.length > 0 && (
            <>
              <Heading size='sm' mt='4' mb='2'>
                Cóctel de insecticidas
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 4 }} gap='2'>
                {exportSentSelected.insecticideSent?.map((item, index) => (
                  <DisplayField
                    key={index}
                    label={`Insecticida ${index + 1}`}
                    value={`${item?.insecticide?.name} (Cant: ${item.quantity})`}
                  />
                ))}
              </SimpleGrid>
            </>
          )}
      </Box>

      <Formik
        initialValues={finalValues}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={finalValidationSchema}
      >
        {({ values, dirty, isSubmitting }) => (
          <Form>
            <UnsavedChangesGuard isDirty={dirty && !isSubmitting} />
            <Flex direction='column' gap='4'>
              <FormSectionTitle divider>
                Datos para la hoja de corte
              </FormSectionTitle>
              <SelectCuttingType name='cuttingTypeId' />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap='4'>
                <InputFieldSelector
                  name={'palletsHeight'}
                  label={'Altura de palets '}
                  alignItems='flex-end'
                  options={palletsOptions}
                />
                <InputFieldSelector
                  name={'containerPositioning'}
                  label={'Posicion del contenedor '}
                  alignItems='flex-end'
                  options={CONTAINER_POSITIONS}
                />
                <InputFieldText
                  name={'belowDeck'}
                  label={'Bajo cubierta '}
                  isReadOnly
                  defaultValue={belowDeckFor(values.containerPositioning)}
                  placeholder='Bajo cubierta'
                  alignItems='flex-end'
                />
              </SimpleGrid>
              <FormActions
                start={
                  <CheckboxForm
                    name='dataReviewed'
                    label='He revisado los datos agregados'
                  />
                }
              >
                <Button type='submit' colorPalette='green' loading={isLoading}>
                  Generar hoja
                </Button>
              </FormActions>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CuttingSheetForm;
