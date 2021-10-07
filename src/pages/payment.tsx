import { HStack, Radio, RadioGroup, useToast } from '@chakra-ui/react';
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
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { Loading } from '../components/ui/loading';

const PaymentPage: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const { changePaymentMethod, paymentMethod } = useOrder();
  const { payment_methods, isLoading, isError, errorMessage } =
    usePaymentMethods();

  const { message } = router.query;

  const paymentMethods = payment_methods
    ? payment_methods
        .filter((pm) => pm.status === 'active')
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
    : [];

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

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Erro',
        description: errorMessage,
        status: 'error',
        variant: 'solid',
        isClosable: true,
      });
    }
  }, [isError]);

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
        <Card p="3rem" w={{ base: '90%', lg: '50%' }}>
          {isLoading && <Loading />}
          <RadioGroup
            w="100%"
            h="100%"
            display="flex"
            flexDir="column"
            gridGap="6"
            onChange={changePaymentMethod}
            value={paymentMethod}
          >
            {paymentMethods.map((pm) => (
              <Radio key={pm.id} size="lg" value={pm.id} colorScheme="purple">
                {pm.name}
              </Radio>
            ))}
            <HStack w="100%" gridGap="2" justifyContent="space-between">
              <Btn
                onClick={backButtonClickHandler}
                buttonStyle="danger"
                w="50%"
              >
                Voltar
              </Btn>
              <Btn
                onClick={continueButtonClickHandler}
                buttonStyle="success"
                w="50%"
              >
                Continuar
              </Btn>
            </HStack>
          </RadioGroup>
        </Card>
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
