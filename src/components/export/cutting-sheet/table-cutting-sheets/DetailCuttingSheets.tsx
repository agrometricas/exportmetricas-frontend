import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { CuttingSheetResponse } from '@/types/cuttingSheet.response';
import { sheetVersionLabel } from '@/utils/cuttingSheetOptions';

const DetailCuttingSheet = ({
  cuttingSheet,
  width,
}: {
  cuttingSheet: CuttingSheetResponse;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  const ex = cuttingSheet.exportSent.export;

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton pl='60px' width={width}>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información General
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
          <Text>
            <strong>ID:</strong> {cuttingSheet.id}
          </Text>
          <Text>
            <strong>Versión:</strong> {sheetVersionLabel(cuttingSheet.version)}
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
            <Link href={cuttingSheet.pdfUrl} target='_blank' color='blue.500'>
              Ver PDF
            </Link>
          </Text>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton pl='60px' width={width}>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Productor y Finca
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton pl='60px' width={width}>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Cliente
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton pl='60px' width={width}>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Puertos
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton pl='60px' width={width}>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Marca de Caja
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
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
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DetailCuttingSheet;
