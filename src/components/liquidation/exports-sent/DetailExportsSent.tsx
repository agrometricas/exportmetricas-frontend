/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import {
  ExportSentType,
  InsecticideSent,
  PesticideSent,
  SheetSent,
  StickerSent,
} from '../../../types/exportSent.response';

const DetailExportSent = ({
  exportSent,
  width,
}: {
  exportSent: ExportSentType;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  const { export: ex } = exportSent;

  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información Comercial del Exportador y Comerciante
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            <p>
              <strong>Nombre del Comerciante:</strong>{' '}
              {ex.merchant.businessName}
            </p>
            <p>
              <strong>RUC:</strong> {ex.merchant.businessId}
            </p>
            <p>
              <strong>Email:</strong> {ex.merchant.email}
            </p>
            <p>
              <strong>Dirección:</strong> {ex.merchant.address},{' '}
            </p>
            <p>
              <strong>Tipo de Contrato:</strong> {ex.merchant.contractType}
            </p>
            <p>
              <strong>Finca:</strong> {ex.business.name}, {ex.business.address}
            </p>
            <p>
              <strong>Tipo de Fruta:</strong> {ex.business.fruitType}
            </p>
            <p>
              <strong>Área Cultivada:</strong> {ex.business.area} ha
            </p>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles del Producto
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            <p>
              <strong>Marca de Cajas:</strong> {ex.boxBrand.name}
            </p>
            <p>
              <strong>Código de Marca:</strong> {ex.boxBrand.brandCode}
            </p>
            <p>
              <strong>Cantidad Total:</strong> {ex.boxQuantity} cajas
            </p>
            <p>
              <strong>Peso Neto por Caja:</strong> {ex.boxBrand.netWeightBox}{' '}
              lbs
            </p>
            <p>
              <strong>Peso Bruto por Caja:</strong> {ex.boxBrand.grossWeightBox}{' '}
              lbs
            </p>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-2'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Materiales y Embalaje Enviados
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            <Box>
              <p>
                <strong>Fondo:</strong> {exportSent.bottomTypeQuantity} unidades
              </p>
              <p>
                <strong>Tapa:</strong> {exportSent.lidTypeQuantity} unidades
              </p>
              <p>
                <strong>Funda:</strong> {exportSent.coverTypeQuantity} unidades
              </p>
              <p>
                <strong>Cartulina:</strong> {exportSent.cardboardTypeQuantity}{' '}
                unidades
              </p>
              <p>
                <strong>Paraseal:</strong> {exportSent.parasealTypeQuantity}{' '}
                unidades
              </p>
              <p>
                <strong>Pad:</strong> {exportSent.padTypeQuantity} unidades
              </p>
              <p>
                <strong>Esponja:</strong> {exportSent.spongeTypeQuantity}
              </p>
              <p>
                <strong>Etiquetas:</strong> {exportSent.labelQuantity} unidades
              </p>
              <p>
                <strong>Bandas:</strong> {exportSent.bandQuantity} unidades
              </p>
              <p>
                <strong>Sachets:</strong> {exportSent.sachetQuantity} unidades
              </p>
              <p>
                <strong>Gomas:</strong> {exportSent.rubberQuantity} unidades
              </p>
              <p>
                <strong>Protectores:</strong> {exportSent.protectorQuantity}{' '}
                unidades
              </p>
              <p>
                <strong>Bolsas de Racimo:</strong>{' '}
                {exportSent.clusterBagQuantity} unidades
              </p>
              <p>
                <strong>Grampas:</strong> {exportSent.stapleQuantity} unidades
              </p>
              <p>
                <strong>Stripping:</strong> {exportSent.strippingQuantity}{' '}
                unidades
              </p>
              <p>
                <strong>Termógrafos:</strong> {exportSent.thermographQuantity}{' '}
                unidades
              </p>
              <p>
                <strong>Sellos:</strong> {exportSent.sealQuantity} unidades
              </p>
              <p>
                <strong>Etiquetas Metto:</strong>{' '}
                {exportSent.mettoLabelQuantity} unidades
              </p>
              <p>
                <strong>Removedor de Látex:</strong>{' '}
                {exportSent.latexRemoverQuantity} unidades
              </p>
              <p>
                <strong>Hojas de Bloqueo:</strong>{' '}
                {exportSent.blockingSheetQuantity} unidades
              </p>
              <p>
                <strong>Plástico de Cierre Contenedor:</strong>{' '}
                {exportSent.containerSealPlasticQuantity} unidades
              </p>
              <p>
                <strong>Kit de Seguridad:</strong>{' '}
                {exportSent.securityKitQuantity} unidades
              </p>
              <p>
                <strong>Tarjeta de Embarque:</strong>{' '}
                {exportSent.boardingCardQuantity} unidades
              </p>
              <p>
                <strong>Stickers:</strong>{' '}
                {exportSent.stickerSent.length
                  ? exportSent.stickerSent
                      .map(
                        (s: StickerSent) =>
                          `${s.sticker.name} (${s.quantity} unidades)`
                      )
                      .join(', ')
                  : 'No disponible'}
              </p>
              <p>
                <strong>Hojas:</strong>{' '}
                {exportSent.sheetSent.length
                  ? exportSent.sheetSent
                      .map(
                        (s: SheetSent) =>
                          `${s.sheet.name} (${s.quantity} unidades)`
                      )
                      .join(', ')
                  : 'No disponible'}
              </p>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-3'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Insumos Post Cosecha
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            <Box>
              <p>
                <strong>Pesticidas:</strong>{' '}
                {exportSent.pesticideSent.length
                  ? exportSent.pesticideSent
                      .map(
                        (p: PesticideSent) =>
                          `${p.pesticide.name} (${p.quantity} unidades)`
                      )
                      .join(', ')
                  : 'No disponible'}
              </p>
              <p>
                <strong>Insecticidas:</strong>{' '}
                {exportSent.insecticideSent.length
                  ? exportSent.insecticideSent
                      .map(
                        (i: InsecticideSent) =>
                          `${i.insecticide.name} (${i.quantity} unidades)`
                      )
                      .join(', ')
                  : 'No disponible'}
              </p>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-4'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: width.sm, md: width.md }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Logística de Envío
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'>
          <Accordion.ItemBody>
            <Box>
              <p>
                <strong>Puerto de Salida:</strong>{' '}
                {ex.harborDeparture
                  ? `${ex.harborDeparture.name}, ${ex.harborDeparture.address}, ${ex.harborDeparture.type}`
                  : 'No disponible'}
              </p>
              <p>
                <strong>Puerto de Destino:</strong>{' '}
                {ex.harborDestination
                  ? `${ex.harborDestination.name}, ${ex.harborDestination.address}, ${ex.harborDestination.type}`
                  : 'No disponible'}
              </p>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailExportSent;
