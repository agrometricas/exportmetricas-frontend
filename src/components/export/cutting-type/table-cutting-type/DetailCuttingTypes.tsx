import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { DetailField, DetailFields } from '@/components/ui/DetailFields';

const DetailCuttingTypes = ({
  cuttingType,
}: {
  cuttingType: {
    quality: string;
    shipmentType: string;
    leavesAtHarvest: number;
    maxAgeAtCut: number;
    minCaliber: number;
    maxCaliber: number;
    fingerLength: string;
    saneos: string;
    cunas: string;
    clusterDetail: string;
    labelDetail: string;
    firstLine?: string;
    secondLine?: string;
    thirdLine?: string;
    fourthLine?: string;
    packagingPattern: string;
    palletDetail: string;
    cornerProtectorsDetail: string;
    reinforcementsDetail: string;
    plasticStrapsDetail: string;
    staplesDetail: string;
    blockingSheetsDetail: string;
    transportDetail: string;
    generalObservations?: string;
  };
}): React.JSX.Element => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box
              as='span'
              flex='1'
              textAlign='left'
              fontSize='md'
              fontWeight='bold'
            >
              Detalles Generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Calidad'>{cuttingType.quality}</DetailField>
                <DetailField label='Tipo de envío'>
                  {cuttingType.shipmentType}
                </DetailField>
                <DetailField label='Hojas en cosecha'>
                  {cuttingType.leavesAtHarvest}
                </DetailField>
                <DetailField label='Edad máxima al corte'>
                  {cuttingType.maxAgeAtCut}
                </DetailField>
                <DetailField label='Calibre mínimo'>
                  {cuttingType.minCaliber}
                </DetailField>
                <DetailField label='Calibre máximo'>
                  {cuttingType.maxCaliber}
                </DetailField>
                <DetailField label='Longitud del dedo'>
                  {cuttingType.fingerLength}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box
              as='span'
              flex='1'
              textAlign='left'
              fontSize='md'
              fontWeight='bold'
            >
              Transporte y Observaciones
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Detalle del racimo'>
                  {cuttingType.clusterDetail}
                </DetailField>
                <DetailField label='Detalle de la etiqueta'>
                  {cuttingType.labelDetail}
                </DetailField>
                <DetailField label='Primera línea'>
                  {cuttingType.firstLine || 'N/A'}
                </DetailField>
                <DetailField label='Segunda línea'>
                  {cuttingType.secondLine || 'N/A'}
                </DetailField>
                <DetailField label='Tercera línea'>
                  {cuttingType.thirdLine || 'N/A'}
                </DetailField>
                <DetailField label='Cuarta línea'>
                  {cuttingType.fourthLine || 'N/A'}
                </DetailField>
                <DetailField label='Patrón de empaquetado'>
                  {cuttingType.packagingPattern}
                </DetailField>
                <DetailField label='Detalle de pallet'>
                  {cuttingType.palletDetail}
                </DetailField>
                <DetailField label='Esquineros'>
                  {cuttingType.cornerProtectorsDetail}
                </DetailField>
                <DetailField label='Refuerzos'>
                  {cuttingType.reinforcementsDetail}
                </DetailField>
                <DetailField label='Cintas plásticas'>
                  {cuttingType.plasticStrapsDetail}
                </DetailField>
                <DetailField label='Grapas'>
                  {cuttingType.staplesDetail}
                </DetailField>
                <DetailField label='Hojas de bloqueo'>
                  {cuttingType.blockingSheetsDetail}
                </DetailField>
                <DetailField label='Detalle de transporte'>
                  {cuttingType.transportDetail}
                </DetailField>
                <DetailField label='Observaciones generales'>
                  {cuttingType.generalObservations || 'Sin observaciones'}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailCuttingTypes;
