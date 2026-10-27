import { Box, Button, Input, SimpleGrid, Field } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldPesticideSelect from './InputFieldPesticideSelect';
import { useFumigationProposal } from '../../../../hooks/box-brand/post-harvest/pesticide/getFumigationProposal';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import { PesticideType } from '../../../../types/box-brand/post-harvest/pesticide';
import { FumigationProposal } from '../../../../types/suppliesProposal';
import { proposedQuantity } from '../../../../utils/suppliesProposal';
import InputFieldQuantity from '../../../ui/form/InputFieldQuantity';

interface SelectPesticideProps {
  name1: string;
  name2: string;
  isDisabledRemove?: boolean;
  pesticideSelect?: Partial<PesticideType>;
  setPesticideSelect?: (pesticide: Partial<PesticideType> | null) => void;
  onClickRemove?: () => void;
  boxQuantity?: number | '';
  unit?: string;
}

const SelectPesticide: React.FC<SelectPesticideProps> = ({
  name1,
  name2,
  isDisabledRemove,
  pesticideSelect,
  setPesticideSelect,
  onClickRemove,
  boxQuantity,
  unit,
}) => {
  const [pesticide, setPesticide] = useState<Partial<PesticideType> | null>(
    null
  );
  const boxes = useDebouncedValue(Number(boxQuantity) || 0, 400);
  const { data: fumigation } = useFumigationProposal(boxes);

  useEffect(() => {
    if (!!pesticideSelect) {
      setPesticide(pesticideSelect);
    }
  }, [pesticideSelect]);

  useEffect(() => {
    if (!!setPesticideSelect) {
      setPesticideSelect(pesticide);
    }
  }, [pesticide, setPesticideSelect]);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
      <InputFieldPesticideSelect
        name={name1}
        label={'Agroquímico'}
        placeholder={'Seleccione el Pesticida'}
        setPesticide={setPesticide}
      />

      <Box>
        <Field.Label>Ingrediente Activo</Field.Label>
        <Input
          readOnly={true}
          value={pesticide?.activeIngredient || ''}
          placeholder={'Ingrediente Activo'}
        />
      </Box>
      <Box>
        <Field.Label>Presentación</Field.Label>
        <Input
          readOnly={true}
          value={pesticide?.presentation || ''}
          placeholder='Presentación'
        />
      </Box>
      <Box>
        <Field.Label>Dosis</Field.Label>
        <Input
          readOnly={true}
          value={pesticide?.dose || ''}
          placeholder={'Dosis'}
        />
      </Box>

      <InputFieldQuantity
        name={name2}
        label={'Cantidad (cajas × dosis)'}
        unit={unit}
        max={10000000}
        quantity={proposedQuantity(
          fumigation as FumigationProposal[] | undefined,
          'pesticideId',
          pesticide?.id
        )}
      />

      <Box display='flex' alignItems='flex-end'>
        <Button
          variant='solid'
          colorPalette='red'
          disabled={isDisabledRemove}
          onClick={onClickRemove}
          width={'100%'}
        >
          Eliminar Pesticida
        </Button>
      </Box>
    </SimpleGrid>
  );
};

export default SelectPesticide;
