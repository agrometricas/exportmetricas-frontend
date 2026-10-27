import { Accordion, Box, Heading } from '@chakra-ui/react';
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
            <p>
              <strong>Nombre Comercial:</strong> {materialDetail.name}
            </p>
            <p>
              <strong>Código:</strong> {materialDetail.code}
            </p>
            <p>
              <strong>Tipo de Material:</strong>{' '}
              {MATERIAL_TYPE_LABELS[materialType] ?? materialType}
            </p>
            <p>
              <strong>Stock Asignado:</strong> {assignedStock} unidades
            </p>
            <p>
              <strong>Stock Actual:</strong> {currentStock} unidades
            </p>
            <p>
              <strong>Costo Asignado:</strong> ${assignedCost.toFixed(2)}
            </p>
            <p>
              <strong>Costo Actual:</strong> ${currentCost.toFixed(2)}
            </p>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
