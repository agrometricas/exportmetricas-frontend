import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useState } from 'react';
import InputFieldExportSelect from './InputFieldExportSelect';
import { ExportType } from '../../types/export';
import { FormLabel } from '../ui/form/FormLabel';

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
        placeholder={'Selecciona la exportación'}
        setExport={setExportSelected}
      />
      <Box>
        <FormLabel>Cantidad de cajas</FormLabel>
        <Input readOnly={true} value={exportSelected?.boxQuantity || ''} />
      </Box>
    </SimpleGrid>
  );
};

export default SelectExport;
