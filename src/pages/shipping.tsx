import React, { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import { Formik, Form, Field } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { APP_NAME } from '../utils/constants';
import { MainContainer } from '../components/ui/main-container';
import { Btn } from '../components/ui/btn';
import { Title } from '../components/ui/title';
import { request } from '../utils/request';
import { getError } from '../utils/get-error';
import { useRouter } from 'next/dist/client/router';
import validations, {
  validateNumeric,
  validatePostalCode,
  validateRequiredField,
} from '../utils/validators';
import { useOrder } from '../hooks/useOrder';
import { Card } from '../components/ui/card';

type AddressInfo = {
  firstName: string;
  lastName: string;
  address: string;
  number: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
};

type ShippingPage = { username: string; addressInfo?: AddressInfo };

const ShippingPage: NextPage<ShippingPage> = ({ username, addressInfo }) => {
  const router = useRouter();
  const { changeAddressInfo } = useOrder();
  const toast = useToast();

  const { message } = router.query;

  const [userFirstName, userLastName] = username?.split(' ');

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

  const formSubmitHandler = async (values: AddressInfo) => {
    try {
      changeAddressInfo(values);

      router.push('/payment');
    } catch (ex: any) {
      toast({
        title: ex.response?.data?.error || 'Erro interno',
        description: getError(ex),
        status: 'error',
        variant: 'solid',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Endereço</title>
      </Head>
      <MainContainer>
        <Title textAlign="center">Endereço para entrega</Title>
        <Formik
          onSubmit={formSubmitHandler}
          initialValues={{
            firstName: userFirstName || '',
            lastName: userLastName || '',
            address: addressInfo?.address || '',
            city: addressInfo?.city || '',
            district: addressInfo?.district || '',
            number: addressInfo?.number || '',
            postalCode: addressInfo?.postalCode || '',
            state: addressInfo?.state || 'São Paulo',
          }}
        >
          {(props) => (
            <Form>
              <Card p="3rem" w={{ base: '90%', lg: '50%' }} gridGap="6">
                <HStack w="100%" alignItems="center" justifyContent="center">
                  <Field
                    name="firstName"
                    validate={(val: string) =>
                      validations(val, 'Primeiro nome', validateRequiredField)
                    }
                  >
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        id="firstName"
                        w="50%"
                        isInvalid={
                          form.errors.firstName && form.touched.firstName
                        }
                      >
                        <FormLabel
                          fontSize="lg"
                          fontWeight="medium"
                          htmlFor="firstName"
                        >
                          Primeiro Nome
                        </FormLabel>
                        <Input {...field} placeholder="Seu nome" />
                        <FormErrorMessage>
                          {form.errors.firstName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="lastName"
                    validate={(val: string) =>
                      validations(val, 'Último nome', validateRequiredField)
                    }
                  >
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        id="lastName"
                        w="50%"
                        isInvalid={
                          form.errors.lastName && form.touched.lastName
                        }
                      >
                        <FormLabel
                          fontSize="lg"
                          fontWeight="medium"
                          htmlFor="lastName"
                        >
                          Último Nome
                        </FormLabel>
                        <Input {...field} placeholder="Seu nome" />
                        <FormErrorMessage>
                          {form.errors.lastName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <HStack w="100%" alignItems="center" justifyContent="center">
                  <Field
                    name="address"
                    validate={(val: string) =>
                      validations(val, 'Endereço', validateRequiredField)
                    }
                  >
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        w="80%"
                        id="address"
                        isInvalid={form.errors.address && form.touched.address}
                      >
                        <FormLabel
                          fontSize="lg"
                          fontWeight="medium"
                          htmlFor="address"
                        >
                          Endereço
                        </FormLabel>
                        <Input {...field} placeholder="Seu endereço" />
                        <FormErrorMessage>
                          {form.errors.address}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="number"
                    validate={(val: string) =>
                      validations(
                        val,
                        'Nº',
                        validateRequiredField,
                        validateNumeric,
                      )
                    }
                  >
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        w="20%"
                        id="number"
                        isInvalid={form.errors.number && form.touched.number}
                      >
                        <FormLabel
                          fontSize="lg"
                          fontWeight="medium"
                          htmlFor="number"
                        >
                          Nro.
                        </FormLabel>
                        <Input {...field} placeholder="Nº" />
                        <FormErrorMessage>
                          {form.errors.number}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <HStack w="100%" alignItems="center" justifyContent="center">
                  <Field
                    name="district"
                    validate={(val: string) =>
                      validations(val, 'Bairro', validateRequiredField)
                    }
                  >
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        w="70%"
                        id="district"
                        isInvalid={
                          form.errors.district && form.touched.district
                        }
                      >
                        <FormLabel
                          fontSize="lg"
                          fontWeight="medium"
                          htmlFor="district"
                        >
                          Bairro
                        </FormLabel>
                        <Input {...field} placeholder="Seu bairro" />
                        <FormErrorMessage>
                          {form.errors.district}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="postalCode"
                    validate={(val: string) =>
                      validations(
                        val,
                        'CEP',
                        validateRequiredField,
                        validatePostalCode,
                      )
                    }
                  >
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        w="30%"
                        id="postalCode"
                        isInvalid={
                          form.errors.postalCode && form.touched.postalCode
                        }
                      >
                        <FormLabel
                          fontSize="lg"
                          fontWeight="medium"
                          htmlFor="postalCode"
                        >
                          CEP
                        </FormLabel>
                        <Input {...field} placeholder="00000-000" />
                        <FormErrorMessage>
                          {form.errors.postalCode}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <HStack w="100%" alignItems="center" justifyContent="center">
                  <Field
                    name="city"
                    validate={(val: string) =>
                      validations(val, 'Cidade', validateRequiredField)
                    }
                  >
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        w="80%"
                        id="city"
                        isInvalid={form.errors.city && form.touched.city}
                      >
                        <FormLabel
                          fontSize="lg"
                          fontWeight="medium"
                          htmlFor="city"
                        >
                          Cidade
                        </FormLabel>
                        <Input {...field} placeholder="Sua cidade" />
                        <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="state"
                    validate={(val: string) =>
                      validations(val, 'Estado', validateRequiredField)
                    }
                  >
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        w="20%"
                        id="state"
                        isInvalid={form.errors.state && form.touched.state}
                      >
                        <FormLabel
                          fontSize="lg"
                          fontWeight="medium"
                          htmlFor="state"
                        >
                          Estado
                        </FormLabel>
                        <Input {...field} />
                        <FormErrorMessage>{form.errors.state}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <Btn
                  w="50%"
                  border="1px solid"
                  borderColor="gray.500"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Continuar
                </Btn>
              </Card>
            </Form>
          )}
        </Formik>
      </MainContainer>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN, ADDRESS_INFO } = nookies.get(ctx);

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
          destination: '/login?message=Usuário inválido&redirect=shipping',
          permanent: false,
        },
      };
    }

    const addressInfo = ADDRESS_INFO ? JSON.parse(ADDRESS_INFO) : null;

    return { props: { username: data?.user?.name, addressInfo } };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default ShippingPage;
