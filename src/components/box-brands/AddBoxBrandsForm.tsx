/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import {
  Box,
  Button,
  Flex,
  Menu,
  NativeSelect,
  SimpleGrid,
  Separator,
  Field,
  Portal,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  useFormikContext,
} from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import * as Yup from 'yup';
import {
  FormSectionTitle,
  FormSubsectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateBoxBrand } from '@/hooks/box-brand/createBoxBrand';
import { getBoxBrand } from '@/hooks/box-brand/getBoxBrand';
import { useBoxBrands } from '@/hooks/box-brand/getBoxBrands';
import { BoxBrandType } from '@/types/box-brand/boxBrand';
import BlockingSheetSelectBanContainer from './additions/blocking-sheet/BlockingSheetSelectBanContainer';
import BoardingCardSelectBanContainer from './additions/boarding-card/BoardingCardBanContainer';
import ContainerSealPlasticSelectBanContainer from './additions/container-seal-plastic/ContainerSealPlasticBanContainer';
import SelectInsecticideBanContainer from './additions/insecticide/SelectInsecticideBanContainer';
import LatexRemoverSelectBanContainer from './additions/latex-remover/LatexRemoverSelectBanContainer';
import SecurityKitSelectBanContainer from './additions/security-kit/SecurityKitBanContainer';
import SheetSelectBanContainer from './additions/sheet/SheetSelectBanContainer';
import StickerSelectBanContainer from './additions/sticker/StickerSelectBanContainer';
import {
  boxBrandCopyValues,
  MaterialSection,
  OPTIONAL_MATERIALS,
  usedOptionalMaterials,
} from './boxBrandCopy';
import MettoLabelSelectBanContainer from './container/metto-label/MettoLabelSelectBanContainer';
import SealSelectBanContainer from './container/seal/SealSelectBanContainer';
import StapleSelectBanContainer from './container/staple/StapleSelectBanContainer';
import StrippingSelectBanContainer from './container/stripping/StrippingSelectBanContainer';
import ThermographSelectBanContainer from './container/thermograph/ThermographSelectBanContainer';
import ImportBoxBrandDrawer from './ImportBoxBrandDrawer';
import BandSelectBanContanier from './materials/band/BandSelectBanContanier';
import BottomSelectBanContanier from './materials/bottom/BottomSelectBanContanier';
import CardboardSelectBanContanier from './materials/cardboard/CardboardSelectBanContainer';
import ClusterBagSelectBanContainer from './materials/cluster-bag/ClusterBagSelectBanContainer';
import CornerSelectBanContainer from './materials/corner/CornerSelectBanContainer';
import CoverSelectBanContanier from './materials/cover/CoverSelectBanContainer';
import LabelSelectBanContainer from './materials/label/LabelSelectBanContainer';
import LidSelectBanContanier from './materials/lid/LidSelectBanContainer';
import MiniPalletSelectBanContanier from './materials/minipallets/MiniPalletSelectBanContainer';
import PackingTapeSelectBanContanier from './materials/packingtape/PackingTapeSelectBanContainer';
import PadSelectBanContainer from './materials/pad/PadSelectBanContainer';
import PalletSelectBanContanier from './materials/pallet/PalletSelectBanContainer';
import ParasealSelectBanContainer from './materials/paraseal/ParasealSelectBanContainer';
import ProtectorSelectBanContainer from './materials/protector/ProtectorSelectBanContainer';
import ReinforcementSelectBanContainer from './materials/reinforcement/ReinforcementSelectBanContainer';
import RubberSelectBanContainer from './materials/rubber/RubberSelectBanContainer';
import SachetSelectBanContainer from './materials/sachet/SachetSelectBanContainer';
import SpongeSelectBanContainer from './materials/sponge/SpongeSelectBanContainer';
import SelectPesticide from './post-harvest/pesticide/SelectPesticide';
import InputFieldBrandSelect from './specifications/brand/InputFieldBrandSelect';
import InputFieldRequiredCertificateMultiSelect from './specifications/requiredCertificate/InputFieldRequiredCertificateMultiSelect';
import { useBoxTypes } from '../../hooks/box-type/getBoxTypes';
import { useMaterialUnits } from '../../hooks/settings/materialUnits';
import { BoxTypeResponse, CargoType } from '../../types/boxType';
import { MaterialUnitsResponse } from '../../types/materialUnits';
import {
  boxQuantityLabel,
  cargoBody,
  CARGO_TYPE_OPTIONS,
  NO_PALLETS,
} from '../../utils/cargoType';
import { quantityUnit } from '../../utils/materialUnits';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';
import UnsavedChangesGuard from '../ui/form/UnsavedChangesGuard';

interface PesticideProps {
  pesticideId: number | '';
  quantity: number | '';
}

export interface InsecticideProps {
  insecticideId: number | '';
  quantity: number | '';
}

export interface StickerProps {
  stickerId: number | '';
  quantity: number | '';
}

export interface SheetProps {
  sheetId: number | '';
  quantity: number | '';
}

interface ValuesProps {
  // specifications
  brandId: number | '';
  name: string;
  brandCode: string;
  boxQuantity: number | '';
  netWeightBox: number | '';
  grossWeightBox: number | '';
  cargoType: CargoType | '';
  boxTypeId: number | string | '';
  requiredCertificates: number[] | null;

  // materials
  bottomTypeId: number | '';
  bottomTypeQuantity: number | '';
  lidTypeId: number | '';
  lidTypeQuantity: number | '';
  coverTypeId: number | '';
  coverTypeQuantity: number | '';
  cardboardTypeId: number | '';
  cardboardTypeQuantity: number | '';
  parasealTypeId: number | '';
  parasealTypeQuantity: number | '';
  padTypeId: number | '';
  padTypeQuantity: number | '';
  spongeTypeId: number | '';
  spongeTypeQuantity: number | '';
  // select
  labelId: number | '';
  labelQuantity: number | '';
  bandId: number | '';
  bandQuantity: number | '';
  sachetId: number | '';
  sachetQuantity: number | '';
  rubberId: number | '';
  rubberQuantity: number | '';
  protectorId: number | '';
  protectorQuantity: number | '';
  clusterBagId: number | '';
  clusterBagQuantity: number | '';

  // post harvest
  pesticides: PesticideProps[];

  // container
  palletsTypeId: number | '';
  palletsTypeQuantity: number | '';
  miniPalletsTypeId: number | '';
  miniPalletsTypeQuantity: number | '';
  cornerTypeId: number | '';
  cornerTypeQuantity: number | '';
  reinforcementTypeId: number | '';
  reinforcementTypeQuantity: number | '';
  // select
  stapleId: number | '';
  stapleQuantity: number | '';
  strippingId: number | '';
  strippingQuantity: number | '';
  thermographId: number | '';
  thermographQuantity: number | '';
  sealId: number | '';
  sealQuantity: number | '';
  mettoLabelId: number | '';
  mettoLabelQuantity: number | '';

  // additions
  packingTapeTypeId: number | '';
  packingTapeTypeQuantity: number | '';
  // select
  latexRemoverId: number | '';
  latexRemoverQuantity: number | '';
  insecticides: InsecticideProps[];
  stickers: StickerProps[];
  sheets: SheetProps[];
  blockingSheetId: number | '';
  blockingSheetQuantity: number | '';
  containerSealPlasticId: number | '';
  containerSealPlasticQuantity: number | '';
  securityKitId: number | '';
  securityKitQuantity: number | '';
  boardingCardId: number | '';
  boardingCardQuantity: number | '';
}

const initialValues: ValuesProps = {
  brandId: '',
  name: '',
  brandCode: '',
  boxQuantity: '',
  netWeightBox: '',
  grossWeightBox: '',
  cargoType: 'CONTAINER',
  boxTypeId: '',
  requiredCertificates: null,

  bottomTypeId: '',
  bottomTypeQuantity: '',
  lidTypeId: '',
  lidTypeQuantity: '',
  coverTypeId: '',
  coverTypeQuantity: '',
  cardboardTypeId: '',
  cardboardTypeQuantity: '',
  parasealTypeId: '',
  parasealTypeQuantity: 0,
  padTypeId: '',
  padTypeQuantity: 0,
  spongeTypeId: '',
  spongeTypeQuantity: 0,

  labelId: '',
  labelQuantity: 0,
  bandId: '',
  bandQuantity: 0,
  sachetId: '',
  sachetQuantity: 0,
  rubberId: '',
  rubberQuantity: 0,
  protectorId: '',
  protectorQuantity: 0,
  clusterBagId: '',
  clusterBagQuantity: 0,

  pesticides: [{ pesticideId: '', quantity: '' }],

  palletsTypeId: '',
  palletsTypeQuantity: '',
  miniPalletsTypeId: '',
  miniPalletsTypeQuantity: '',
  cornerTypeId: '',
  cornerTypeQuantity: 0,
  reinforcementTypeId: '',
  reinforcementTypeQuantity: 0,

  stapleId: '',
  stapleQuantity: 0,
  strippingId: '',
  strippingQuantity: 0,
  thermographId: '',
  thermographQuantity: 0,
  sealId: '',
  sealQuantity: 0,
  mettoLabelId: '',
  mettoLabelQuantity: 0,

  packingTapeTypeId: '',
  packingTapeTypeQuantity: 0,

  latexRemoverId: '',
  latexRemoverQuantity: 0,
  insecticides: [],
  stickers: [],
  sheets: [],
  blockingSheetId: '',
  blockingSheetQuantity: 0,
  containerSealPlasticId: '',
  containerSealPlasticQuantity: 0,
  securityKitId: '',
  securityKitQuantity: 0,
  boardingCardId: '',
  boardingCardQuantity: 0,
};

const pesticideSchema = Yup.object().shape({
  pesticideId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  quantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
});

const insecticideSchema = Yup.object().shape({
  insecticideId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  quantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(10000, 'Debe ser menor que 10000 ')
    .required('Requerido'),
});

const stickerSchema = Yup.object().shape({
  stickerId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  quantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(100000, 'Debe ser menor que 100000 ')
    .required('Requerido'),
});

const sheetSchema = Yup.object().shape({
  sheetId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  quantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(10000, 'Debe ser menor que 10000 ')
    .required('Requerido'),
});

const validationSchema = Yup.object({
  brandId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  name: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .matches(/^\S.*\S$/, 'No debe tener espacios al principio ni al final')
    .matches(
      /^(?!.*\s{2,}).*$/,
      'No debe tener múltiples espacios consecutivos'
    )
    .transform((value) => value.trim())
    .required('Requerido'),
  brandCode: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .matches(/^[a-zA-Z0-9]+$/, 'Solo debe contener letras y números')
    .transform((value) => value.trim())
    .required('Requerido'),
  boxQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(10000, 'Debe ser menor que 10000 cajas')
    .required('Requerido'),
  netWeightBox: Yup.number()
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(100, 'Debe ser menor que 100 libras')
    .test(
      'is-decimal',
      'Debe tener como máximo 2 decimales',
      (value) => (value + '').match(/^\d+(\.\d{1,2})?$/) !== null
    )
    .required('Requerido'),
  grossWeightBox: Yup.number()
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(100, 'Debe ser menor que 100 libras')
    .min(
      Yup.ref('netWeightBox'),
      'No puede ser menor que el peso neto de la caja'
    )
    .test(
      'is-decimal',
      'Debe tener como máximo 2 decimales',
      (value) => (value + '').match(/^\d+(\.\d{1,2})?$/) !== null
    )
    .required('Requerido'),
  cargoType: Yup.string()
    .oneOf(['CONTAINER', 'BULK'], 'Selecciona el tipo de carga')
    .required('Requerido'),
  requiredCertificates: Yup.array()
    .min(1, 'Selecciona al menos un certificado')
    .of(Yup.number().required())
    .nullable()
    .required('Requerido'),
  bottomTypeId: Yup.mixed().when('bottomTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  bottomTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { bottomTypeId } = this.parent;
        if (
          bottomTypeId === undefined ||
          bottomTypeId === null ||
          bottomTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  lidTypeId: Yup.mixed().when('lidTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  lidTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { lidTypeId } = this.parent;
        if (lidTypeId === undefined || lidTypeId === null || lidTypeId === '') {
          return value === 0;
        }
        return value > 0;
      }
    ),
  coverTypeId: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { coverTypeId } = this.parent;
        if (
          coverTypeId === undefined ||
          coverTypeId === null ||
          coverTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  coverTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { cardboardTypeId } = this.parent;
        if (
          cardboardTypeId === undefined ||
          cardboardTypeId === null ||
          cardboardTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  cardboardTypeId: Yup.mixed().when('cardboardTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  cardboardTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { cardboardTypeId } = this.parent;
        if (
          cardboardTypeId === undefined ||
          cardboardTypeId === null ||
          cardboardTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  parasealTypeId: Yup.mixed().when('parasealTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  parasealTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { parasealTypeId } = this.parent;
        if (
          parasealTypeId === undefined ||
          parasealTypeId === null ||
          parasealTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  padTypeId: Yup.mixed().when('padTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  padTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { padTypeId } = this.parent;
        if (padTypeId === undefined || padTypeId === null || padTypeId === '') {
          return value === 0;
        }
        return value > 0;
      }
    ),
  spongeTypeId: Yup.mixed().when('spongeTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  spongeTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { spongeTypeId } = this.parent;
        if (
          spongeTypeId === undefined ||
          spongeTypeId === null ||
          spongeTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  labelId: Yup.mixed().when('labelQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  labelQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { labelId } = this.parent;
        if (labelId === undefined || labelId === null || labelId === '') {
          return value === 0;
        }
        return value > 0;
      }
    ),
  bandId: Yup.mixed().when('bandQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  bandQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { bandId } = this.parent;
        if (bandId === undefined || bandId === null || bandId === '') {
          return value === 0;
        }
        return value > 0;
      }
    ),
  sachetId: Yup.mixed().when('sachetQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  sachetQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { sachetId } = this.parent;
        if (sachetId === undefined || sachetId === null || sachetId === '') {
          return value === 0;
        }
        return value > 0;
      }
    ),
  rubberId: Yup.mixed().when('rubberQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  rubberQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { rubberId } = this.parent;
        if (rubberId === undefined || rubberId === null || rubberId === '') {
          return value === 0;
        }
        return value > 0;
      }
    ),
  protectorId: Yup.mixed().when('protectorQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  protectorQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { protectorId } = this.parent;
        if (
          protectorId === undefined ||
          protectorId === null ||
          protectorId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  clusterBagId: Yup.mixed().when('clusterBagQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  clusterBagQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { clusterBagId } = this.parent;
        if (
          clusterBagId === undefined ||
          clusterBagId === null ||
          clusterBagId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  pesticides: Yup.array()
    .of(pesticideSchema)
    .min(1, 'Debe tener al menos un pesticida'),
  palletsTypeId: Yup.mixed().when('palletsTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  palletsTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { palletsTypeId } = this.parent;
        if (
          palletsTypeId === undefined ||
          palletsTypeId === null ||
          palletsTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  miniPalletsTypeId: Yup.mixed().when('miniPalletsTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  miniPalletsTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { miniPalletsTypeId } = this.parent;
        if (
          miniPalletsTypeId === undefined ||
          miniPalletsTypeId === null ||
          miniPalletsTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  cornerTypeId: Yup.mixed().when('cornerTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  cornerTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { cornerTypeId } = this.parent;
        if (
          cornerTypeId === undefined ||
          cornerTypeId === null ||
          cornerTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  reinforcementTypeId: Yup.mixed().when('reinforcementTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  reinforcementTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { reinforcementTypeId } = this.parent;
        if (
          reinforcementTypeId === undefined ||
          reinforcementTypeId === null ||
          reinforcementTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  stapleId: Yup.mixed().when('stapleQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  stapleQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { stapleId } = this.parent;
        if (stapleId === undefined || stapleId === null || stapleId === '') {
          return value === 0;
        }
        return value > 0;
      }
    ),
  strippingId: Yup.mixed().when('strippingQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  strippingQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { strippingId } = this.parent;
        if (
          strippingId === undefined ||
          strippingId === null ||
          strippingId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  thermographId: Yup.mixed().when('thermographQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  thermographQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { thermographId } = this.parent;
        if (
          thermographId === undefined ||
          thermographId === null ||
          thermographId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  sealId: Yup.mixed().when('sealQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  sealQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { sealId } = this.parent;
        if (sealId === undefined || sealId === null || sealId === '') {
          return value === 0;
        }
        return value > 0;
      }
    ),
  mettoLabelId: Yup.mixed().when('mettoLabelQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  mettoLabelQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { mettoLabelId } = this.parent;
        if (
          mettoLabelId === undefined ||
          mettoLabelId === null ||
          mettoLabelId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  packingTapeTypeId: Yup.mixed().when('packingTapeTypeQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  packingTapeTypeQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { packingTapeTypeId } = this.parent;
        if (
          packingTapeTypeId === undefined ||
          packingTapeTypeId === null ||
          packingTapeTypeId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  latexRemoverId: Yup.mixed().when('latexRemoverQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  latexRemoverQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { latexRemoverId } = this.parent;
        if (
          latexRemoverId === undefined ||
          latexRemoverId === null ||
          latexRemoverId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  blockingSheetId: Yup.mixed().when('blockingSheetQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  blockingSheetQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { blockingSheetId } = this.parent;
        if (
          blockingSheetId === undefined ||
          blockingSheetId === null ||
          blockingSheetId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  containerSealPlasticId: Yup.mixed().when('containerSealPlasticQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  containerSealPlasticQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { containerSealPlasticId } = this.parent;
        if (
          containerSealPlasticId === undefined ||
          containerSealPlasticId === null ||
          containerSealPlasticId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  securityKitId: Yup.mixed().when('securityKitQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  securityKitQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { securityKitId } = this.parent;
        if (
          securityKitId === undefined ||
          securityKitId === null ||
          securityKitId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  boardingCardId: Yup.mixed().when('boardingCardQuantity', {
    is: (value: number) => value > 0,
    then: (schema) => schema.required('Requerido'),
    otherwise: (schema) => schema.nullable(),
  }),
  boardingCardQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .required('Requerido')
    .test(
      'is-zero-when-no-option',
      'Debe ser 0 si no se selecciona una opción',
      function (value) {
        const { boardingCardId } = this.parent;
        if (
          boardingCardId === undefined ||
          boardingCardId === null ||
          boardingCardId === ''
        ) {
          return value === 0;
        }
        return value > 0;
      }
    ),
  stickers: Yup.array()
    .of(stickerSchema)
    .min(0, 'Debe tener 0 o más stickers'),
  sheets: Yup.array().of(sheetSchema).min(0, 'Debe tener 0 o más sheets'),
  insecticides: Yup.array()
    .of(insecticideSchema)
    .min(0, 'Debe tener 0 o más pesticidas'),
});

interface InputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  unit?: string;
}

const specificationsInputFieldsText: InputFieldProps[] = [
  { name: 'name', label: 'Nickname' },
  { name: 'brandCode', label: 'Código' },
];

const weightInputFields: InputFieldProps[] = [
  { name: 'netWeightBox', label: 'Peso neto de caja', unit: 'lb' },
  { name: 'grossWeightBox', label: 'Peso bruto de caja', unit: 'lb' },
];

function ClearPalletsOnBulk(): null {
  const { values, setFieldValue } = useFormikContext<ValuesProps>();
  useEffect(() => {
    if (values.cargoType !== 'BULK') return;
    setFieldValue('palletsTypeId', '');
    setFieldValue('palletsTypeQuantity', 0);
    setFieldValue('miniPalletsTypeId', '');
    setFieldValue('miniPalletsTypeQuantity', 0);
  }, [values.cargoType, setFieldValue]);
  return null;
}

function CopyFromBoxBrand({
  onCopied,
}: {
  onCopied: (shown: string[]) => void;
}): React.JSX.Element | null {
  const { values, setValues } = useFormikContext<ValuesProps>();
  const { data } = useBoxBrands({ search: '', page: 1, limit: 10 });
  const [isCopying, setIsCopying] = useState(false);
  const boxBrands = (data ?? []) as BoxBrandType[];
  if (boxBrands.length === 0) return null;

  const copy = async (boxBrandId: string): Promise<void> => {
    if (!boxBrandId) return;
    setIsCopying(true);
    try {
      const { data: saved } = await getBoxBrand({ boxBrandId });
      const copied = boxBrandCopyValues(saved);
      await setValues({ ...values, ...copied } as ValuesProps);
      onCopied(usedOptionalMaterials(copied));
    } catch (error) {
      toaster.create({
        title: 'No se pudo copiar la alícuota',
        description: serverErrorMessage(error),
        type: 'error',
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Field.Root>
      <Field.Label fontSize='sm' mb='8px'>
        Partir de otra alícuota (opcional)
      </Field.Label>
      <NativeSelect.Root disabled={isCopying}>
        <NativeSelect.Field
          placeholder='Empezar en blanco'
          onChange={(event) => copy(event.target.value)}
        >
          {boxBrands.map((boxBrand) => (
            <option key={boxBrand.id} value={boxBrand.id}>
              {boxBrand.brand?.name} - {boxBrand.name}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <Field.HelperText>
        Copia sus materiales, cantidades y cócteles. El nombre y el código se
        escriben de nuevo.
      </Field.HelperText>
    </Field.Root>
  );
}

function AddMaterialMenu({
  section,
  shown,
  onAdd,
}: {
  section: MaterialSection;
  shown: string[];
  onAdd: (field: string) => void;
}): React.JSX.Element | null {
  const hidden = OPTIONAL_MATERIALS.filter(
    (material) =>
      material.section === section && !shown.includes(material.field)
  );
  if (hidden.length === 0) return null;
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          size='sm'
          variant='outline'
          colorPalette='green'
          alignSelf='flex-start'
        >
          <FiPlus />
          Agregar material
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {hidden.map((material) => (
              <Menu.Item
                key={material.field}
                onSelect={() => onAdd(material.field)}
                value='item-0'
              >
                {material.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export default function AddBoxBrandsForm(): React.JSX.Element {
  const [shownMaterials, setShownMaterials] = useState<string[]>([]);
  const shown = (field: string): boolean => shownMaterials.includes(field);
  const addMaterial = (field: string): void =>
    setShownMaterials((current) => [...current, field]);
  const router = useRouter();
  const { data: unitsConfig } = useMaterialUnits();
  const unitOf = (type: string): string | undefined =>
    (unitsConfig as MaterialUnitsResponse | undefined)?.materials.find(
      (material) => material.materialType === type
    )?.unit;
  const perBox = (type: string): string => quantityUnit(unitOf(type), 'caja');
  const perContainer = (type: string): string =>
    quantityUnit(unitOf(type), 'contenedor');
  const { createBoxBrand, isPending: isLoading } = useCreateBoxBrand();
  const { data: boxTypes } = useBoxTypes();
  const boxTypeOptions = ((boxTypes ?? []) as BoxTypeResponse[]).map(
    ({ id, name }) => ({ id, name })
  );
  const queryClient = useQueryClient();

  const addBoxBrands = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    const {
      netWeightBox,
      grossWeightBox,
      boxQuantity,
      cargoType,
      boxTypeId,
      ...boxBrandData
    } = values;

    createBoxBrand(
      {
        ...boxBrandData,
        boxQuantity: Number(boxQuantity),
        netWeightBox: Number(netWeightBox),
        grossWeightBox: Number(grossWeightBox),
        // Materiales por caja
        bottomTypeId: !!values.bottomTypeId ? values.bottomTypeId : 0,
        lidTypeId: !!values.lidTypeId ? values.lidTypeId : 0,
        coverTypeId: !!values.coverTypeId ? values.coverTypeId : 0,
        cardboardTypeId: !!values.cardboardTypeId ? values.cardboardTypeId : 0,
        parasealTypeId: !!values.parasealTypeId ? values.parasealTypeId : 0,
        padTypeId: !!values.padTypeId ? values.padTypeId : 0,
        spongeTypeId: !!values.spongeTypeId ? values.spongeTypeId : 0,
        labelId: !!values.labelId ? values.labelId : 0,
        bandId: !!values.bandId ? values.bandId : 0,
        sachetId: !!values.sachetId ? values.sachetId : 0,
        rubberId: !!values.rubberId ? values.rubberId : 0,
        protectorId: !!values.protectorId ? values.protectorId : 0,
        clusterBagId: !!values.clusterBagId ? values.clusterBagId : 0,
        // Materiales por contenedor
        palletsTypeId: !!values.palletsTypeId ? values.palletsTypeId : 0,
        miniPalletsTypeId: !!values.miniPalletsTypeId
          ? values.miniPalletsTypeId
          : 0,
        cornerTypeId: !!values.cornerTypeId ? values.cornerTypeId : 0,
        reinforcementTypeId: !!values.reinforcementTypeId
          ? values.reinforcementTypeId
          : 0,
        stapleId: !!values.stapleId ? values.stapleId : 0,
        strippingId: !!values.strippingId ? values.strippingId : 0,
        thermographId: !!values.thermographId ? values.thermographId : 0,
        sealId: !!values.sealId ? values.sealId : 0,
        mettoLabelId: !!values.mettoLabelId ? values.mettoLabelId : 0,
        // Adicionales
        latexRemoverId: !!values.latexRemoverId ? values.latexRemoverId : 0,
        blockingSheetId: !!values.blockingSheetId ? values.blockingSheetId : 0,
        containerSealPlasticId: !!values.containerSealPlasticId
          ? values.containerSealPlasticId
          : 0,
        securityKitId: !!values.securityKitId ? values.securityKitId : 0,
        boardingCardId: !!values.boardingCardId ? values.boardingCardId : 0,
        packingTapeTypeId: !!values.packingTapeTypeId
          ? values.packingTapeTypeId
          : 0,
        ...cargoBody({ cargoType, boxTypeId }),
        ...(cargoType === 'BULK' ? NO_PALLETS : {}),
      },
      {
        onError: (error: any) => {
          const { statusCode, message, model, prop } =
            error.response?.data ?? {};

          toaster.create({
            title: 'No se pudo guardar',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 5000,
            closable: true,
          });

          if (statusCode === 401) {
            router.push('/api/auth/signout');
          }

          if (model === 'BoxBrand' && prop === 'brandCode') {
            formikHelpers.setFieldTouched(`${prop}`, true, false);
            formikHelpers.setFieldError(`${prop}`, message);
          }
        },
        onSuccess: () => {
          toaster.create({
            title: 'Alícuota creada con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });

          queryClient.invalidateQueries({
            queryKey: ['boxBrands']
          });
          formikHelpers.resetForm();
          router.push('/dashboard/box-brands/search');
        },
      }
    );
    return;
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={addBoxBrands}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, values, dirty }) => (
          <Form>
            <UnsavedChangesGuard isDirty={dirty && !isSubmitting} />
            <ClearPalletsOnBulk />
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle actions={<ImportBoxBrandDrawer />}>
                Especificaciones
              </FormSectionTitle>
              <CopyFromBoxBrand onCopied={setShownMaterials} />

              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                <InputFieldBrandSelect
                  name={'brandId'}
                  label={'Marca'}
                  placeholder={'Selecciona la marca'}
                />
                {specificationsInputFieldsText.map((field, index) => (
                  <InputFieldText
                    key={index}
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                  />
                ))}

                <InputFieldSelector
                  name='cargoType'
                  label='Tipo de carga'
                  options={CARGO_TYPE_OPTIONS}
                />
                <InputFieldSelector
                  name='boxTypeId'
                  label='Tipo de caja'
                  placeholder='Sin tipo de caja'
                  options={boxTypeOptions}
                />
                <InputFieldPlain
                  name='boxQuantity'
                  label={boxQuantityLabel(values.cargoType)}
                  unit={values.cargoType === 'BULK' ? 'cajas' : 'C/C'}
                  inputMode='numeric'
                />
                {weightInputFields.map((field, index) => (
                  <InputFieldPlain
                    key={index}
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    unit={field.unit}
                    inputMode='decimal'
                  />
                ))}
                <InputFieldRequiredCertificateMultiSelect
                  name={'requiredCertificates'}
                  label={'Certificado/s Requerido/s'}
                  placeholder={'Selecciona el/los certificado/s'}
                />
              </SimpleGrid>

              <FormSectionTitle>Materiales por caja</FormSectionTitle>
              <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                <BottomSelectBanContanier
                  name1={'bottomTypeId'}
                  label1={'Fondo'}
                  placeholder1={'Selecciona el fondo'}
                  name2={'bottomTypeQuantity'}
                  label2={'Fondos/Caja'}
                  placeholder2={'Cantidad'}
                  unit={perBox('BOTTOM')}
                />

                <LidSelectBanContanier
                  name1={'lidTypeId'}
                  label1={'Tapa'}
                  placeholder1={'Selecciona la tapa'}
                  name2={'lidTypeQuantity'}
                  label2={'Tapas/Caja'}
                  placeholder2={'Cantidad'}
                  unit={perBox('LID')}
                />

                <CoverSelectBanContanier
                  name1={'coverTypeId'}
                  label1={'Funda'}
                  placeholder1={'Selecciona la funda'}
                  name2={'coverTypeQuantity'}
                  label2={'Fundas/Caja'}
                  placeholder2={'Cantidad'}
                  unit={perBox('COVER')}
                />

                <CardboardSelectBanContanier
                  name1={'cardboardTypeId'}
                  label1={'Cartulina/Pad'}
                  placeholder1={'Selecciona la cartulina'}
                  name2={'cardboardTypeQuantity'}
                  label2={'Cartulinas/Caja'}
                  placeholder2={'Cantidad'}
                  unit={perBox('CARDBOARD')}
                />

                {shown('parasealTypeId') && (
                  <ParasealSelectBanContainer
                    name1={'parasealTypeId'}
                    label1={'ParaSeal'}
                    placeholder1={'Selecciona el ParaSeal'}
                    name2={'parasealTypeQuantity'}
                    label2={'ParaSeals/Caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('PARASEAL')}
                  />
                )}

                {shown('padTypeId') && (
                  <PadSelectBanContainer
                    name1={'padTypeId'}
                    label1={'Mini pad'}
                    placeholder1={'Selecciona el pad'}
                    name2={'padTypeQuantity'}
                    label2={'Pads/Caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('PAD')}
                  />
                )}

                {shown('spongeTypeId') && (
                  <SpongeSelectBanContainer
                    name1={'spongeTypeId'}
                    label1={'Esponja'}
                    placeholder1={'Selecciona la esponja'}
                    name2={'spongeTypeQuantity'}
                    label2={'Esponjas/Caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('SPONGE')}
                  />
                )}

                {shown('labelId') && (
                  <LabelSelectBanContainer
                    name1={'labelId'}
                    label1={'Etiqueta'}
                    placeholder1={'Selecciona la etiqueta'}
                    name2={'labelQuantity'}
                    label2={'Etiquetas/Caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('LABEL')}
                  />
                )}
                {shown('bandId') && (
                  <BandSelectBanContanier
                    name1={'bandId'}
                    label1={'Banda'}
                    placeholder1={'Selecciona la banda'}
                    name2={'bandQuantity'}
                    label2={'Bandas/Caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('BAND')}
                  />
                )}
                {shown('sachetId') && (
                  <SachetSelectBanContainer
                    name1={'sachetId'}
                    label1={'Sachet'}
                    placeholder1={'Selecciona el sachet'}
                    name2={'sachetQuantity'}
                    label2={'Sachets/Caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('SACCHET')}
                  />
                )}
                {shown('rubberId') && (
                  <RubberSelectBanContainer
                    name1={'rubberId'}
                    label1={'Liga'}
                    placeholder1={'Selecciona la liga'}
                    name2={'rubberQuantity'}
                    label2={'Ligas/Caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('RUBBER')}
                  />
                )}
                {shown('protectorId') && (
                  <ProtectorSelectBanContainer
                    name1={'protectorId'}
                    label1={'Protector'}
                    placeholder1={'Selecciona el protector'}
                    name2={'protectorQuantity'}
                    label2={'Protectores/Caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('PROTECTOR')}
                  />
                )}
                {shown('clusterBagId') && (
                  <ClusterBagSelectBanContainer
                    name1={'clusterBagId'}
                    label1={'Cluster bag'}
                    placeholder1={'Selecciona el cluster bag'}
                    name2={'clusterBagQuantity'}
                    label2={'Cluster bags/caja'}
                    placeholder2={'Cantidad'}
                    unit={perBox('CLUSTER_BAG')}
                  />
                )}
              </SimpleGrid>
              <AddMaterialMenu
                section='box'
                shown={shownMaterials}
                onAdd={addMaterial}
              />

              <FormSectionTitle>Insumos post cosecha</FormSectionTitle>

              <FormSubsectionTitle>Fumigación post cosecha</FormSubsectionTitle>
              <FieldArray name='pesticides'>
                {({ push, remove }) => (
                  <>
                    {values.pesticides.map((_pesticide, index) => (
                      <div key={index}>
                        <SelectPesticide
                          key={index}
                          name1={`pesticides[${index}].pesticideId`}
                          name2={`pesticides[${index}].quantity`}
                          isDisabledRemove={values.pesticides.length === 1}
                          onClickRemove={() => {
                            remove(index);
                          }}
                          boxQuantity={values.boxQuantity}
                          unit={perContainer('PESTICIDE')}
                        />
                        <Separator
                          mt={'16px'}
                          mb={'8px'}
                          borderWidth={'2px'}
                          variant={'dashed'}
                        />
                      </div>
                    ))}
                    <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                      <Box></Box>
                      <Button
                        onClick={() => push({ pesticideId: '', quantity: '' })}
                      >
                        Agregar pesticida
                      </Button>
                    </SimpleGrid>
                  </>
                )}
              </FieldArray>

              <FormSectionTitle>Materiales por contenedor</FormSectionTitle>
              <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                {values.cargoType !== 'BULK' && (
                  <>
                    <PalletSelectBanContanier
                      name1={'palletsTypeId'}
                      label1={'Pallet'}
                      placeholder1={'Selecciona el pallet'}
                      name2={'palletsTypeQuantity'}
                      label2={'Pallets/Contenedor'}
                      placeholder2={'Cantidad'}
                      unit={perContainer('PALLET')}
                    />

                    <MiniPalletSelectBanContanier
                      name1={'miniPalletsTypeId'}
                      label1={'Mini pallet'}
                      placeholder1={'Selecciona el mini pallet'}
                      name2={'miniPalletsTypeQuantity'}
                      label2={'Mini pallets/contenedor'}
                      placeholder2={'Cantidad'}
                      unit={perContainer('MINI_PALLET')}
                    />
                  </>
                )}

                {shown('cornerTypeId') && (
                  <CornerSelectBanContainer
                    name1={'cornerTypeId'}
                    label1={'Esquineros'}
                    placeholder1={'Selecciona el esquinero'}
                    name2={'cornerTypeQuantity'}
                    label2={'Esquineros/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('CORNER')}
                  />
                )}

                {shown('reinforcementTypeId') && (
                  <ReinforcementSelectBanContainer
                    name1={'reinforcementTypeId'}
                    label1={'Refuerzo'}
                    placeholder1={'Selecciona el refuerzo'}
                    name2={'reinforcementTypeQuantity'}
                    label2={'Refuerzos/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('REINFORCEMENT')}
                  />
                )}

                {shown('stapleId') && (
                  <StapleSelectBanContainer
                    name1={'stapleId'}
                    label1={'Grapa'}
                    placeholder1={'Selecciona la grapa'}
                    name2={'stapleQuantity'}
                    label2={'Grapas/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('STAPLE')}
                  />
                )}
                {shown('strippingId') && (
                  <StrippingSelectBanContainer
                    name1={'strippingId'}
                    label1={'Zuncho'}
                    placeholder1={'Selecciona el zuncho'}
                    name2={'strippingQuantity'}
                    label2={'Zunchos/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('STRIPPING')}
                  />
                )}
                {shown('thermographId') && (
                  <ThermographSelectBanContainer
                    name1={'thermographId'}
                    label1={'Termografo'}
                    placeholder1={'Selecciona el termografo'}
                    name2={'thermographQuantity'}
                    label2={'Termografos/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('THERMOGRAPH')}
                  />
                )}
                {shown('sealId') && (
                  <SealSelectBanContainer
                    name1={'sealId'}
                    label1={'Sello'}
                    placeholder1={'Selecciona el sello'}
                    name2={'sealQuantity'}
                    label2={'Sellos/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('SEAL')}
                  />
                )}
                {shown('mettoLabelId') && (
                  <MettoLabelSelectBanContainer
                    name1={'mettoLabelId'}
                    label1={'Etiqueta Metto'}
                    placeholder1={'Selecciona la Etiqueta Metto'}
                    name2={'mettoLabelQuantity'}
                    label2={'Etiquetas Metto/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('METTO_LABEL')}
                  />
                )}
              </SimpleGrid>
              <AddMaterialMenu
                section='container'
                shown={shownMaterials}
                onAdd={addMaterial}
              />

              <FormSectionTitle>Adicionales</FormSectionTitle>
              <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                {shown('packingTapeTypeId') && (
                  <PackingTapeSelectBanContanier
                    name1={'packingTapeTypeId'}
                    label1={'Cinta de embalaje'}
                    placeholder1={'Selecciona la cinta de embalaje'}
                    name2={'packingTapeTypeQuantity'}
                    label2={'Cintas/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('PACKING_TAPE')}
                  />
                )}

                {shown('latexRemoverId') && (
                  <LatexRemoverSelectBanContainer
                    name1={'latexRemoverId'}
                    label1={'Removedor de latex'}
                    placeholder1={'Selecciona el removedor de latex'}
                    name2={'latexRemoverQuantity'}
                    label2={'Removedores/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('LATEX_REMOVER')}
                  />
                )}
                {shown('blockingSheetId') && (
                  <BlockingSheetSelectBanContainer
                    name1={'blockingSheetId'}
                    label1={'Lamina de bloqueo'}
                    placeholder1={'Selecciona la lamina de bloqueo'}
                    name2={'blockingSheetQuantity'}
                    label2={'Laminas/Contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('BLOCKING_SHEET')}
                  />
                )}
                {shown('containerSealPlasticId') && (
                  <ContainerSealPlasticSelectBanContainer
                    name1={'containerSealPlasticId'}
                    label1={'Plástico de cierre contenedor'}
                    placeholder1={'Selecciona el plástico de cierre contenedor'}
                    name2={'containerSealPlasticQuantity'}
                    label2={'Plásticos de cierre contenedor/contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('CONTAINER_SEAL_PLASTIC')}
                  />
                )}
                {shown('securityKitId') && (
                  <SecurityKitSelectBanContainer
                    name1={'securityKitId'}
                    label1={'Kit de seguridad'}
                    placeholder1={'Selecciona el kit de seguridad'}
                    name2={'securityKitQuantity'}
                    label2={'Kits de seguridad/contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('SECURITY_KIT')}
                  />
                )}
                {shown('boardingCardId') && (
                  <BoardingCardSelectBanContainer
                    name1={'boardingCardId'}
                    label1={'Tarjeta de embarque'}
                    placeholder1={'Selecciona la tarjeta de embarque'}
                    name2={'boardingCardQuantity'}
                    label2={'Tarjetas de embarque/contenedor'}
                    placeholder2={'Cantidad'}
                    unit={perContainer('BOARDING_CARD')}
                  />
                )}
              </SimpleGrid>
              <AddMaterialMenu
                section='additions'
                shown={shownMaterials}
                onAdd={addMaterial}
              />
              <StickerSelectBanContainer
                name={'stickers'}
                stickers={values.stickers}
              />
              <SheetSelectBanContainer name={'sheets'} sheets={values.sheets} />
              <SelectInsecticideBanContainer
                name={'insecticides'}
                insecticides={values.insecticides}
              />

              <FormActions>
                <Button
                  type='submit'
                  colorPalette='green'
                  loading={isSubmitting || isLoading}
                >
                  Crear alícuota
                </Button>
              </FormActions>
            </Flex>
          </Form>
        )}
      </Formik>
    </>
  );
}
