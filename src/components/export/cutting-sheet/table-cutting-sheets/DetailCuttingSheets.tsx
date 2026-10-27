import { Accordion, Box, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import { DetailField, DetailFields } from '@/components/ui/DetailFields';
import { CuttingSheetResponse } from '@/types/cuttingSheet.response';
import { sheetVersionLabel } from '@/utils/cuttingSheetOptions';

const DetailCuttingSheet = ({
  cuttingSheet,
}: {
  cuttingSheet: CuttingSheetResponse;
}): React.JSX.Element => {
  const ex = cuttingSheet.exportSent.export;

  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información General
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='ID'>{cuttingSheet.id}</DetailField>
              <DetailField label='Versión'>
                {sheetVersionLabel(cuttingSheet.version)}
              </DetailField>
              {cuttingSheet.correctionReason && (
                <DetailField label='Motivo de la corrección'>
                  {cuttingSheet.correctionReason}
                </DetailField>
              )}
              <DetailField label='Altura pallet'>
                {cuttingSheet.palletsHeight}
              </DetailField>
              <DetailField label='Ubicación contenedor'>
                {cuttingSheet.containerPositioning}
              </DetailField>
              <DetailField label='Debajo cubierta'>
                {cuttingSheet.belowDeck}
              </DetailField>
              <DetailField label='PDF'>
                <Link
                  href={cuttingSheet.pdfUrl}
                  target='_blank'
                  color='blue.fg'
                >
                  Ver PDF
                </Link>
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Productor y Finca
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Productor'>
                {ex.merchant.businessName}
              </DetailField>
              <DetailField label='RUC'>{ex.merchant.businessId}</DetailField>
              <DetailField label='Finca'>{ex.business.name}</DetailField>
              <DetailField label='Área'>{ex.business.area} ha</DetailField>
              <DetailField label='Fruta'>{ex.business.fruitType}</DetailField>
              <DetailField label='Dirección'>{ex.business.address}</DetailField>
              <DetailField label='Código MAGAP'>
                {ex.business.codeMAGAP}
              </DetailField>
              <DetailField label='Código AGROCALIDAD'>
                {ex.business.codeAGROCALIDAD}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-2'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Cliente
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre'>{ex.client.businessName}</DetailField>
              <DetailField label='RUC'>{ex.client.businessId}</DetailField>
              <DetailField label='Tipo'>{ex.client.type}</DetailField>
              <DetailField label='Correo'>{ex.client.email}</DetailField>
              <DetailField label='Teléfono'>{ex.client.phone}</DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-3'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Puertos
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Puerto salida'>
                {ex.harborDeparture.name}
              </DetailField>
              <DetailField label='Ubicación'>
                {ex.harborDeparture.location}
              </DetailField>
              <DetailField label='Puerto destino'>
                {ex.harborDestination.name}
              </DetailField>
              <DetailField label='Ubicación'>
                {ex.harborDestination.location}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-4'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Marca de Caja
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre'>{ex.boxBrand.name}</DetailField>
              <DetailField label='Código'>{ex.boxBrand.brandCode}</DetailField>
              <DetailField label='Peso neto'>
                {ex.boxBrand.netWeightBox} lbs
              </DetailField>
              <DetailField label='Peso bruto'>
                {ex.boxBrand.grossWeightBox} lbs
              </DetailField>
              <DetailField label='Cantidad de cajas'>
                {ex.boxQuantity}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailCuttingSheet;
