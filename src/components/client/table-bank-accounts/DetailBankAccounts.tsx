import { Accordion, Heading, Box } from '@chakra-ui/react';
import { DetailField, DetailFields } from '@/components/ui/DetailFields';
import { BankAccountResponse } from '../../../types/bankAccount.response';

const DetailBankAccounts = ({
  account,
}: {
  account: BankAccountResponse;
}): React.JSX.Element => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información de Cuenta
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Banco'>{account.bank}</DetailField>
              <DetailField label='Propietario'>{account.owner}</DetailField>
              <DetailField label='ID Propietario'>
                {account.ownerID}
              </DetailField>
              <DetailField label='Número de Cuenta'>
                {account.accountNumber}
              </DetailField>
              <DetailField label='Tipo de Cuenta'>{account.type}</DetailField>
              <DetailField label='Email'>{account.email}</DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información de Entidad Asociada
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              {account.client && (
                <>
                  <DetailField label='Tipo'>Cliente</DetailField>
                  <DetailField label='Nombre'>
                    {account.client.businessName}
                  </DetailField>
                  <DetailField label='RUC'>
                    {account.client.businessId}
                  </DetailField>
                  <DetailField label='Comercial'>
                    {account.client.commercialType}
                  </DetailField>
                  <DetailField label='Email'>
                    {account.client.email}
                  </DetailField>
                  <DetailField label='Teléfono'>
                    {account.client.phone}
                  </DetailField>
                </>
              )}
              {account.merchant && (
                <>
                  <DetailField label='Tipo'>Productor</DetailField>
                  <DetailField label='Nombre'>
                    {account.merchant.businessName}
                  </DetailField>
                  <DetailField label='RUC'>
                    {account.merchant.businessId}
                  </DetailField>
                  <DetailField label='Email'>
                    {account.merchant.email}
                  </DetailField>
                  <DetailField label='Ciudad'>
                    {account.merchant.city.name}
                  </DetailField>
                  <DetailField label='Dirección'>
                    {account.merchant.address}
                  </DetailField>
                </>
              )}
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailBankAccounts;
