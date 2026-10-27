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
                <DetailField label='Tipo de Envío'>
                  {cuttingType.shipmentType}
                </DetailField>
                <DetailField label='Hojas en Cosecha'>
                  {cuttingType.leavesAtHarvest}
                </DetailField>
                <DetailField label='Edad Máxima al Corte'>
                  {cuttingType.maxAgeAtCut}
                </DetailField>
                <DetailField label='Calibre Mínimo'>
                  {cuttingType.minCaliber}
                </DetailField>
                <DetailField label='Calibre Máximo'>
                  {cuttingType.maxCaliber}
                </DetailField>
                <DetailField label='Longitud del Dedo'>
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
                <DetailField label='Detalle del Racimo'>
                  {cuttingType.clusterDetail}
                </DetailField>
                <DetailField label='Detalle de la Etiqueta'>
                  {cuttingType.labelDetail}
                </DetailField>
                <DetailField label='Primera Línea'>
                  {cuttingType.firstLine || 'N/A'}
                </DetailField>
                <DetailField label='Segunda Línea'>
                  {cuttingType.secondLine || 'N/A'}
                </DetailField>
                <DetailField label='Tercera Línea'>
                  {cuttingType.thirdLine || 'N/A'}
                </DetailField>
                <DetailField label='Cuarta Línea'>
                  {cuttingType.fourthLine || 'N/A'}
                </DetailField>
                <DetailField label='Patrón de Empaquetado'>
                  {cuttingType.packagingPattern}
                </DetailField>
                <DetailField label='Detalle de Pallet'>
                  {cuttingType.palletDetail}
                </DetailField>
                <DetailField label='Esquineros'>
                  {cuttingType.cornerProtectorsDetail}
                </DetailField>
                <DetailField label='Refuerzos'>
                  {cuttingType.reinforcementsDetail}
                </DetailField>
                <DetailField label='Cintas Plásticas'>
                  {cuttingType.plasticStrapsDetail}
                </DetailField>
                <DetailField label='Grapas'>
                  {cuttingType.staplesDetail}
                </DetailField>
                <DetailField label='Hojas de Bloqueo'>
                  {cuttingType.blockingSheetsDetail}
                </DetailField>
                <DetailField label='Detalle de Transporte'>
                  {cuttingType.transportDetail}
                </DetailField>
                <DetailField label='Observaciones Generales'>
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
