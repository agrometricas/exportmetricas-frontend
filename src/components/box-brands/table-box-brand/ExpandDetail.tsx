/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { InsecticideCocktailPart } from '../../../types/box-brand/additions/insecticideCocktailPart';
import { SheetCocktail } from '../../../types/box-brand/additions/sheet';
import { StickerCocktail } from '../../../types/box-brand/additions/sticker';
import { PesticideCocktailPart } from '../../../types/box-brand/post-harvest/pesticideCocktailPart';
import { RequiredCertificateType } from '../../../types/box-brand/specifications/requiredCertificate';

interface DetailType {
  activeIngredient?: string;
  art?: string;
  code?: string;
  color?: string;
  description?: string;
  dimensions?: string;
  dose?: number;
  id?: number;
  name?: string;
  quantityPerPack?: number;
  quantityPerRoll?: number;
  type?: string;
  weightPerPack?: number;
}

const isDetailType = (detail: any): detail is DetailType => {
  return (
    detail &&
    (detail.activeIngredient !== undefined ||
      detail.art !== undefined ||
      detail.code !== undefined ||
      detail.color !== undefined ||
      detail.description !== undefined ||
      detail.dimensions !== undefined ||
      detail.dose !== undefined ||
      detail.id !== undefined ||
      detail.name !== undefined ||
      detail.quantityPerPack !== undefined ||
      detail.quantityPerRoll !== undefined ||
      detail.type !== undefined ||
      detail.weightPerPack !== undefined)
  );
};

const isRequiredCertificateTypeArray = (
  detail: any
): detail is RequiredCertificateType[] => {
  return (
    Array.isArray(detail) &&
    detail.every(
      (item) =>
        typeof item === 'object' &&
        'id' in item &&
        'name' in item &&
        (typeof item.id === 'number' || item.id === '') &&
        typeof item.name === 'string'
    )
  );
};

const isPesticideCocktailPartArray = (
  detail: any
): detail is PesticideCocktailPart[] => {
  return (
    Array.isArray(detail) &&
    detail.every(
      (item) =>
        typeof item === 'object' &&
        (typeof item.id === 'number' || item.id === '') &&
        (typeof item.quantity === 'number' || item.quantity === '') &&
        typeof item.pesticide === 'object'
    )
  );
};

const isInsecticideCocktailPartArray = (
  detail: any
): detail is InsecticideCocktailPart[] => {
  return (
    Array.isArray(detail) &&
    detail.every(
      (item) =>
        typeof item === 'object' &&
        (typeof item.id === 'number' || item.id === '') &&
        (typeof item.quantity === 'number' || item.quantity === '') &&
        typeof item.insecticide === 'object'
    )
  );
};

const isStickerCocktailArray = (detail: any): detail is StickerCocktail[] => {
  return (
    Array.isArray(detail) &&
    detail.every(
      (item) =>
        typeof item === 'object' &&
        (typeof item.id === 'number' || item.id === '') &&
        (typeof item.quantity === 'number' || item.quantity === '') &&
        typeof item.sticker === 'object'
    )
  );
};

const isSheetCocktailArray = (detail: any): detail is SheetCocktail[] => {
  return (
    Array.isArray(detail) &&
    detail.every(
      (item) =>
        typeof item === 'object' &&
        (typeof item.id === 'number' || item.id === '') &&
        (typeof item.quantity === 'number' || item.quantity === '') &&
        typeof item.sheet === 'object'
    )
  );
};

const ExpandDetail = ({
  detail,
}: {
  detail:
    | DetailType
    | PesticideCocktailPart[]
    | InsecticideCocktailPart[]
    | RequiredCertificateType[]
    | StickerCocktail[]
    | SheetCocktail[];
}): React.JSX.Element | undefined => {
  if (isDetailType(detail)) {
    return (
      <SimpleGrid columns={2} spacing={0} width={'100%'} ml={'60px'}>
        {detail.name && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Nombre:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.name}
            </Text>
          </Heading>
        )}
        {detail.quantityPerPack && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Cantidad por paquete:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.quantityPerPack}
            </Text>
          </Heading>
        )}
        {detail.quantityPerRoll && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Cantidad por rollo:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.quantityPerRoll}
            </Text>
          </Heading>
        )}
        {detail.weightPerPack && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Peso por paquete:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.weightPerPack}
            </Text>
          </Heading>
        )}
        {detail.code && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Codigo:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.code}
            </Text>
          </Heading>
        )}
        {detail.dimensions && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Dimensiones:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.dimensions}
            </Text>
          </Heading>
        )}
        {detail.description && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Descripcion:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.description}
            </Text>
          </Heading>
        )}
        {detail.art && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Arte:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.art}
            </Text>
          </Heading>
        )}
        {detail.type && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Tipo:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.type}
            </Text>
          </Heading>
        )}
        {detail.color && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Color:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.color}
            </Text>
          </Heading>
        )}
        {detail.activeIngredient && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Ingrediente Activo:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.activeIngredient}
            </Text>
          </Heading>
        )}
        {detail.dose && (
          <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
            Dosis:{' '}
            <Text as={'span'} fontWeight={'normal'}>
              {detail.dose}
            </Text>
          </Heading>
        )}
      </SimpleGrid>
    );
  }

  if (isRequiredCertificateTypeArray(detail)) {
    return (
      <SimpleGrid columns={2} spacing={0} width={'100%'} ml={'60px'}>
        <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
          Certificados:
        </Heading>
        <Box></Box>
        {detail.map((certificate) => (
          <Text
            key={certificate.id}
            as={'span'}
            fontWeight={'normal'}
            p={'16px'}
          >
            {certificate.name}
          </Text>
        ))}
      </SimpleGrid>
    );
  }

  if (isPesticideCocktailPartArray(detail)) {
    return (
      <VStack>
        {detail.map((pesticide) => (
          <Box key={pesticide.id}>
            <SimpleGrid columns={2} spacing={0} width={'100%'} ml={'0px'}>
              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Nombre:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {pesticide.pesticide.name}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Nombre Comercial:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {pesticide.pesticide.brandName}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Ingrediente Activo:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {pesticide.pesticide.activeIngredient}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Dosis:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {pesticide.pesticide.dose}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Presentacion:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {pesticide.pesticide.presentation}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Cantidad:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {pesticide.quantity}
                </Text>
              </Heading>
            </SimpleGrid>
            <Divider
              mt={'16px'}
              mb={'8px'}
              borderWidth={'2px'}
              variant={'dashed'}
              borderColor={'whitesmoke'}
            />
          </Box>
        ))}
      </VStack>
    );
  }

  if (isInsecticideCocktailPartArray(detail)) {
    return (
      <VStack>
        {detail.map((insecticide) => (
          <Box key={insecticide.id}>
            <SimpleGrid columns={2} spacing={0} width={'100%'} ml={'0px'}>
              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Nombre:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {insecticide.insecticide.name}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Ingrediente Activo:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {insecticide.insecticide.activeIngredient}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Dosis:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {insecticide.insecticide.dose}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Cantidad:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {insecticide.quantity}
                </Text>
              </Heading>
            </SimpleGrid>
            <Divider
              mt={'16px'}
              mb={'8px'}
              borderWidth={'2px'}
              variant={'dashed'}
              borderColor={'whitesmoke'}
            />
          </Box>
        ))}
      </VStack>
    );
  }

  if (isSheetCocktailArray(detail)) {
    return (
      <VStack>
        {detail.map((sheet) => (
          <Box key={sheet.id}>
            <SimpleGrid columns={2} spacing={0} width={'100%'} ml={'0px'}>
              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Nombre:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {sheet.sheet.name}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Cantidad:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {sheet.quantity}
                </Text>
              </Heading>
            </SimpleGrid>
            <Divider
              mt={'16px'}
              mb={'8px'}
              borderWidth={'2px'}
              variant={'dashed'}
              borderColor={'whitesmoke'}
            />
          </Box>
        ))}
      </VStack>
    );
  }

  if (isStickerCocktailArray(detail)) {
    return (
      <VStack>
        {detail.map((sticker) => (
          <Box key={sticker.id}>
            <SimpleGrid columns={2} spacing={0} width={'100%'} ml={'0px'}>
              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Nombre:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {sticker.sticker.name}
                </Text>
              </Heading>

              <Heading fontSize={'md'} fontWeight={'bold'} p={'16px'}>
                Cantidad:{' '}
                <Text as={'span'} fontWeight={'normal'}>
                  {sticker.quantity}
                </Text>
              </Heading>
            </SimpleGrid>
            <Divider
              mt={'16px'}
              mb={'8px'}
              borderWidth={'2px'}
              variant={'dashed'}
              borderColor={'whitesmoke'}
            />
          </Box>
        ))}
      </VStack>
    );
  }
};

export default ExpandDetail;
