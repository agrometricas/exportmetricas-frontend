import { Table } from '@chakra-ui/react';
import React from 'react';
import { InsecticideCocktailPart } from '../../../types/box-brand/additions/insecticideCocktailPart';
import { PesticideCocktailPart } from '../../../types/box-brand/post-harvest/pesticideCocktailPart';
import {
  InsecticideSentPartType,
  PesticideSentPartType,
} from '../../../types/exportSent';

interface Props {
  cocktailNeed: PesticideCocktailPart[] | InsecticideCocktailPart[];
  cocktailSent: PesticideSentPartType[] | InsecticideSentPartType[];
}

interface CocktailProps {
  name: string;
  need: number;
  sent: number;
}

const DetailCocktail = ({
  cocktailNeed,
  cocktailSent,
}: Props): React.JSX.Element => {
  const cocktail: CocktailProps[] = cocktailSent.map((item, index) => {
    const name: string =
      (item as PesticideSentPartType).pesticide.name ||
      (item as InsecticideSentPartType).insecticide.name ||
      '';

    const need: number =
      (cocktailNeed[index] as PesticideCocktailPart).quantity ||
      (cocktailNeed[index] as InsecticideCocktailPart).quantity ||
      0;

    const sent: number =
      (item as PesticideSentPartType).quantity ||
      (item as InsecticideSentPartType).quantity ||
      0;

    return { name, need, sent };
  });

  return (
    <>
      <Table.ScrollArea>
        <Table.Root variant='line'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Nombre</Table.ColumnHeader>
              <Table.ColumnHeader>Necesario</Table.ColumnHeader>
              <Table.ColumnHeader>Enviado</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {cocktail.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.need}</Table.Cell>
                <Table.Cell>{item.sent}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </>
  );
};

export default DetailCocktail;
