import { Radio, RadioGroup, useToast, VStack } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useEffect } from 'react';
import nookies from 'nookies';
import { Btn } from '../components/ui/btn';
import { Card } from '../components/ui/card';
import { MainContainer } from '../components/ui/main-container';
import { Title } from '../components/ui/title';
import { useOrder } from '../hooks/useOrder';
import { APP_NAME } from '../utils/constants';
import { request } from '../utils/request';
import { getError } from '../utils/get-error';

const PaymentPage: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const { changePaymentMethod, paymentMethod } = useOrder();

  const { message } = router.query;

  useEffect(() => {
    if (message) {
      toast({
        title: 'Erro',
        description: String(message),
        status: 'error',
        variant: 'solid',
        isClosable: true,
      });
    }
  }, []);

  const continueButtonClickHandler = () => {
    router.push('/placeorder');
  };

  const backButtonClickHandler = () => {
    router.push('/shipping');
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Forma de pagamento</title>
      </Head>
      <MainContainer>
        <Title textAlign="center">
          Escolha a forma de pagamento mais adequada
        </Title>
        <RadioGroup onChange={changePaymentMethod} value={paymentMethod}>
          <Card
            p="3rem"
            w={{ base: '90%', lg: '50%' }}
            gridGap="6"
            alignItems="flex-start"
          >
            <Radio size="lg" value="Boleto" colorScheme="purple">
              Boleto
            </Radio>
            <Radio size="lg" value="Cartão de Crédito" colorScheme="purple">
              Cartão de Crédito
            </Radio>
            <Radio size="lg" value="Mercado Pago" colorScheme="purple">
              Mercado Pago
            </Radio>
            <VStack w="100%" gridGap="2">
              <Btn
                onClick={continueButtonClickHandler}
                buttonStyle="success"
                w="50%"
              >
                Continuar
              </Btn>
              <Btn
                onClick={backButtonClickHandler}
                buttonStyle="danger"
                w="50%"
              >
                Voltar
              </Btn>
            </VStack>
          </Card>
        </RadioGroup>
      </MainContainer>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);

  if (!USER_TOKEN) {
    return {
      redirect: { destination: '/login?redirect=shipping', permanent: false },
    };
  }

  try {
    const { data } = await request.get('auth', {
      headers: { Authorization: 'Bearer ' + USER_TOKEN },
    });
    if (!data?.isValid) {
      return {
        redirect: {
          destination: '/login?message=Usuário inválido',
          permanent: false,
        },
      };
    }

    return { props: {} };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default PaymentPage;
