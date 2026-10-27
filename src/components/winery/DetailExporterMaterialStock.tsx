import { Accordion, Box, Heading } from '@chakra-ui/react';
import { DetailField, DetailFields } from '@/components/ui/DetailFields';
import { ExporterMaterialStock } from '../../types/winery/exporterMaterialStock.response';
import { MATERIAL_TYPE_LABELS } from '../../utils/materialTypeLabels';

export default function DetailExporterMaterialStock({
  material,
}: {
  material: ExporterMaterialStock;
}): JSX.Element {
  const {
    materialType,
    assignedStock,
    currentStock,
    assignedCost,
    currentCost,
    materialDetail,
  } = material;

  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles del Material
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre comercial'>
                {materialDetail.name}
              </DetailField>
              <DetailField label='Código'>{materialDetail.code}</DetailField>
              <DetailField label='Tipo de material'>
                {MATERIAL_TYPE_LABELS[materialType] ?? materialType}
              </DetailField>
              <DetailField label='Stock asignado'>
                {assignedStock} unidades
              </DetailField>
              <DetailField label='Stock actual'>
                {currentStock} unidades
              </DetailField>
              <DetailField label='Costo asignado'>
                ${assignedCost.toFixed(2)}
              </DetailField>
              <DetailField label='Costo actual'>
                ${currentCost.toFixed(2)}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
