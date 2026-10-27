import {
  Box,
  Button,
  IconButton,
  SimpleGrid,
  Separator,
} from '@chakra-ui/react';
import { FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaBan } from 'react-icons/fa';
import { FormSubsectionTitle } from '@/components/ui/form/FormSection';
import SelectInsecticide from './SelectInsecticide';
import { InsecticideProps } from '../../AddBoxBrandsForm';

interface Props {
  name: string;
  insecticides: InsecticideProps[];
}

const SelectInsecticideBanContainer = ({
  name,
  insecticides,
}: Props): React.JSX.Element => {
  const [isBan, setIsBan] = useState(false);
  const [firstChange, setFirstChange] = useState(false);

  useEffect(() => {
    if (isBan && !firstChange) {
      setFirstChange(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBan]);

  const setBanState = (): void => {
    setIsBan((prevState) => !prevState);
  };

  return (
    <>
      <FormSubsectionTitle>
        Agroquímico adicional{' '}
        {
          <IconButton
            rounded='full'
            ml={'5px'}
            colorPalette={!!isBan ? 'orange' : 'gray'}
            aria-label='Ban'
            size='xs'
            variant={'outline'}
            onClick={setBanState}
          >
            <FaBan size={'20px'} />
          </IconButton>
        }
      </FormSubsectionTitle>
      <FieldArray name={name}>
        {({ push, remove }) => (
          <>
            {insecticides.map((_insecticide, index) => {
              isBan && remove(index);

              return (
                <div key={index}>
                  <SelectInsecticide
                    key={index}
                    name1={`${name}[${index}].insecticideId`}
                    name2={`${name}[${index}].quantity`}
                    isDisabledRemove={insecticides.length === 1}
                    onClickRemove={() => {
                      remove(index);
                    }}
                  />
                  <Separator
                    mt={'16px'}
                    mb={'8px'}
                    borderWidth={'2px'}
                    variant={'dashed'}
                  />
                </div>
              );
            })}
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <Box></Box>
              <Button
                disabled={isBan}
                onClick={() => push({ insecticideId: '', quantity: '' })}
              >
                Agregar Insecticida
              </Button>
            </SimpleGrid>
          </>
        )}
      </FieldArray>
    </>
  );
};

export default SelectInsecticideBanContainer;
