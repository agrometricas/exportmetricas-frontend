import { Box, Input, SimpleGrid, Field } from '@chakra-ui/react';
import React, { useState } from 'react';
import InputFieldExportSelect from './InputFieldExportSelect';
import { ExportType } from '../../types/export';

interface SelectExportProps {
  name: string;
}

const SelectExport: React.FC<SelectExportProps> = ({ name }) => {
  const [exportSelected, setExportSelected] =
    useState<Partial<ExportType> | null>(null);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
      <InputFieldExportSelect
        name={name}
        label={'Exportación'}
        placeholder={'Seleccione la exportación'}
        setExport={setExportSelected}
      />
      <Box>
        <Field.Label>Cantidad de cajas</Field.Label>
        <Input readOnly={true} value={exportSelected?.boxQuantity || ''} />
      </Box>
    </SimpleGrid>
  );
};

export default SelectExport;
