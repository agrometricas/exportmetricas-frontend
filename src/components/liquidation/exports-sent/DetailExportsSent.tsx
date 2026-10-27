/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { DetailField, DetailFields } from '@/components/ui/DetailFields';
import {
  ExportSentType,
  InsecticideSent,
  PesticideSent,
  SheetSent,
  StickerSent,
} from '../../../types/exportSent.response';

const DetailExportSent = ({
  exportSent,
}: {
  exportSent: ExportSentType;
}): React.JSX.Element => {
  const { export: ex } = exportSent;

  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información Comercial del Exportador y Comerciante
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre del Comerciante'>
                {ex.merchant.businessName}
              </DetailField>
              <DetailField label='RUC'>{ex.merchant.businessId}</DetailField>
              <DetailField label='Email'>{ex.merchant.email}</DetailField>
              <DetailField label='Dirección'>{ex.merchant.address}</DetailField>
              <DetailField label='Tipo de Contrato'>
                {ex.merchant.contractType}
              </DetailField>
              <DetailField label='Finca'>
                {ex.business.name}, {ex.business.address}
              </DetailField>
              <DetailField label='Tipo de Fruta'>
                {ex.business.fruitType}
              </DetailField>
              <DetailField label='Área Cultivada'>
                {ex.business.area} ha
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles del Producto
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Marca de Cajas'>
                {ex.boxBrand.name}
              </DetailField>
              <DetailField label='Código de Marca'>
                {ex.boxBrand.brandCode}
              </DetailField>
              <DetailField label='Cantidad Total'>
                {ex.boxQuantity} cajas
              </DetailField>
              <DetailField label='Peso Neto por Caja'>
                {ex.boxBrand.netWeightBox} lbs
              </DetailField>
              <DetailField label='Peso Bruto por Caja'>
                {ex.boxBrand.grossWeightBox} lbs
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-2'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Materiales y Embalaje Enviados
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Fondo'>
                  {exportSent.bottomTypeQuantity} unidades
                </DetailField>
                <DetailField label='Tapa'>
                  {exportSent.lidTypeQuantity} unidades
                </DetailField>
                <DetailField label='Funda'>
                  {exportSent.coverTypeQuantity} unidades
                </DetailField>
                <DetailField label='Cartulina'>
                  {exportSent.cardboardTypeQuantity} unidades
                </DetailField>
                <DetailField label='Paraseal'>
                  {exportSent.parasealTypeQuantity} unidades
                </DetailField>
                <DetailField label='Pad'>
                  {exportSent.padTypeQuantity} unidades
                </DetailField>
                <DetailField label='Esponja'>
                  {exportSent.spongeTypeQuantity}
                </DetailField>
                <DetailField label='Etiquetas'>
                  {exportSent.labelQuantity} unidades
                </DetailField>
                <DetailField label='Bandas'>
                  {exportSent.bandQuantity} unidades
                </DetailField>
                <DetailField label='Sachets'>
                  {exportSent.sachetQuantity} unidades
                </DetailField>
                <DetailField label='Gomas'>
                  {exportSent.rubberQuantity} unidades
                </DetailField>
                <DetailField label='Protectores'>
                  {exportSent.protectorQuantity} unidades
                </DetailField>
                <DetailField label='Bolsas de Racimo'>
                  {exportSent.clusterBagQuantity} unidades
                </DetailField>
                <DetailField label='Grampas'>
                  {exportSent.stapleQuantity} unidades
                </DetailField>
                <DetailField label='Stripping'>
                  {exportSent.strippingQuantity} unidades
                </DetailField>
                <DetailField label='Termógrafos'>
                  {exportSent.thermographQuantity} unidades
                </DetailField>
                <DetailField label='Sellos'>
                  {exportSent.sealQuantity} unidades
                </DetailField>
                <DetailField label='Etiquetas Metto'>
                  {exportSent.mettoLabelQuantity} unidades
                </DetailField>
                <DetailField label='Removedor de Látex'>
                  {exportSent.latexRemoverQuantity} unidades
                </DetailField>
                <DetailField label='Hojas de Bloqueo'>
                  {exportSent.blockingSheetQuantity} unidades
                </DetailField>
                <DetailField label='Plástico de Cierre Contenedor'>
                  {exportSent.containerSealPlasticQuantity} unidades
                </DetailField>
                <DetailField label='Kit de Seguridad'>
                  {exportSent.securityKitQuantity} unidades
                </DetailField>
                <DetailField label='Tarjeta de Embarque'>
                  {exportSent.boardingCardQuantity} unidades
                </DetailField>
                <DetailField label='Stickers'>
                  {exportSent.stickerSent.length
                    ? exportSent.stickerSent
                        .map(
                          (s: StickerSent) =>
                            `${s.sticker.name} (${s.quantity} unidades)`
                        )
                        .join(', ')
                    : 'No disponible'}
                </DetailField>
                <DetailField label='Hojas'>
                  {exportSent.sheetSent.length
                    ? exportSent.sheetSent
                        .map(
                          (s: SheetSent) =>
                            `${s.sheet.name} (${s.quantity} unidades)`
                        )
                        .join(', ')
                    : 'No disponible'}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-3'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Insumos Post Cosecha
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Pesticidas'>
                  {exportSent.pesticideSent.length
                    ? exportSent.pesticideSent
                        .map(
                          (p: PesticideSent) =>
                            `${p.pesticide.name} (${p.quantity} unidades)`
                        )
                        .join(', ')
                    : 'No disponible'}
                </DetailField>
                <DetailField label='Insecticidas'>
                  {exportSent.insecticideSent.length
                    ? exportSent.insecticideSent
                        .map(
                          (i: InsecticideSent) =>
                            `${i.insecticide.name} (${i.quantity} unidades)`
                        )
                        .join(', ')
                    : 'No disponible'}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-4'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Logística de Envío
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Puerto de Salida'>
                  {ex.harborDeparture
                    ? `${ex.harborDeparture.name}, ${ex.harborDeparture.address}, ${ex.harborDeparture.type}`
                    : 'No disponible'}
                </DetailField>
                <DetailField label='Puerto de Destino'>
                  {ex.harborDestination
                    ? `${ex.harborDestination.name}, ${ex.harborDestination.address}, ${ex.harborDestination.type}`
                    : 'No disponible'}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailExportSent;
