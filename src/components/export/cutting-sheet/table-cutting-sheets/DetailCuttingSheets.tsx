import { Accordion, Box, Heading, Text, Link } from '@chakra-ui/react';
import React from 'react';
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
            <Text>
              <strong>ID:</strong> {cuttingSheet.id}
            </Text>
            <Text>
              <strong>Versión:</strong>{' '}
              {sheetVersionLabel(cuttingSheet.version)}
            </Text>
            {cuttingSheet.correctionReason && (
              <Text>
                <strong>Motivo de la corrección:</strong>{' '}
                {cuttingSheet.correctionReason}
              </Text>
            )}
            <Text>
              <strong>Altura Pallet:</strong> {cuttingSheet.palletsHeight}
            </Text>
            <Text>
              <strong>Ubicación Contenedor:</strong>{' '}
              {cuttingSheet.containerPositioning}
            </Text>
            <Text>
              <strong>Debajo Cubierta:</strong> {cuttingSheet.belowDeck}
            </Text>
            <Text>
              <strong>PDF:</strong>{' '}
              <Link href={cuttingSheet.pdfUrl} target='_blank' color='blue.fg'>
                Ver PDF
              </Link>
            </Text>
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
            <Text>
              <strong>Productor:</strong> {ex.merchant.businessName}
            </Text>
            <Text>
              <strong>RUC:</strong> {ex.merchant.businessId}
            </Text>
            <Text>
              <strong>Finca:</strong> {ex.business.name}
            </Text>
            <Text>
              <strong>Área:</strong> {ex.business.area} ha
            </Text>
            <Text>
              <strong>Fruta:</strong> {ex.business.fruitType}
            </Text>
            <Text>
              <strong>Dirección:</strong> {ex.business.address}
            </Text>
            <Text>
              <strong>Código MAGAP:</strong> {ex.business.codeMAGAP}
            </Text>
            <Text>
              <strong>Código AGROCALIDAD:</strong> {ex.business.codeAGROCALIDAD}
            </Text>
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
            <Text>
              <strong>Nombre:</strong> {ex.client.businessName}
            </Text>
            <Text>
              <strong>RUC:</strong> {ex.client.businessId}
            </Text>
            <Text>
              <strong>Tipo:</strong> {ex.client.type}
            </Text>
            <Text>
              <strong>Correo:</strong> {ex.client.email}
            </Text>
            <Text>
              <strong>Teléfono:</strong> {ex.client.phone}
            </Text>
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
            <Text>
              <strong>Puerto Salida:</strong> {ex.harborDeparture.name}
            </Text>
            <Text>
              <strong>Ubicación:</strong> {ex.harborDeparture.location}
            </Text>
            <Text>
              <strong>Puerto Destino:</strong> {ex.harborDestination.name}
            </Text>
            <Text>
              <strong>Ubicación:</strong> {ex.harborDestination.location}
            </Text>
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
            <Text>
              <strong>Nombre:</strong> {ex.boxBrand.name}
            </Text>
            <Text>
              <strong>Código:</strong> {ex.boxBrand.brandCode}
            </Text>
            <Text>
              <strong>Peso Neto:</strong> {ex.boxBrand.netWeightBox} lbs
            </Text>
            <Text>
              <strong>Peso Bruto:</strong> {ex.boxBrand.grossWeightBox} lbs
            </Text>
            <Text>
              <strong>Cantidad de Cajas:</strong> {ex.boxQuantity}
            </Text>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailCuttingSheet;
