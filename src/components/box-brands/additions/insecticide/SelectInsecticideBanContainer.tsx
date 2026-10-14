import {
  Box,
  Button,
  Divider,
  Heading,
  IconButton,
  SimpleGrid,
} from '@chakra-ui/react';
import { FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaBan } from 'react-icons/fa';
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
      <Heading fontSize={'xl'} p={'12px'}>
        Agroquímico adicional{' '}
        {
          <IconButton
            isRound={true}
            ml={'5px'}
            colorScheme={!!isBan ? 'orange' : 'gray'}
            aria-label='Ban'
            size={'base'}
            variant={'outline'}
            icon={<FaBan size={'20px'} />}
            onClick={setBanState}
          />
        }
      </Heading>
      <Divider mb={'16px'} />
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
                  <Divider
                    mt={'16px'}
                    mb={'8px'}
                    borderWidth={'2px'}
                    variant={'dashed'}
                  />
                </div>
              );
            })}
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <Box></Box>
              <Button
                isDisabled={isBan}
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
