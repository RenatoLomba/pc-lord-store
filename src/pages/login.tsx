import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Formik, Form, Field } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  useColorModeValue,
  useToast,
  Text,
  Link,
} from '@chakra-ui/react';
import { APP_NAME } from '../utils/constants';
import { MainContainer } from '../components/ui/main-container';
import { Btn } from '../components/ui/btn';
import { Title } from '../components/ui/title';
import { request } from '../utils/request';
import { getError } from '../utils/get-error';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/dist/client/router';
import { validateEmail, validatePassword } from '../utils/validators';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { loginUser } = useAuth();
  const toast = useToast();
  const cardStyle = useColorModeValue('white', 'gray.700');

  const formSubmitHandler = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await request.post('auth/login', { ...values });
      loginUser(data.user, data.token);

      router.push('/');
    } catch (ex: any) {
      toast({
        title: ex.response?.data?.error || 'Erro interno',
        description: getError(ex),
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Login</title>
      </Head>
      <MainContainer>
        <Title textAlign="center">Faça Login</Title>
        <Formik
          onSubmit={formSubmitHandler}
          initialValues={{ email: '', password: '' }}
        >
          {(props) => (
            <Form>
              <VStack
                bgColor={cardStyle}
                w={{ base: '90%', lg: '50%' }}
                p="3rem"
                borderRadius="lg"
                gridGap="6"
                m="0 auto"
              >
                <Field name="email" validate={validateEmail}>
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      id="email"
                      isInvalid={form.errors.email && form.touched.email}
                    >
                      <FormLabel
                        fontSize="lg"
                        fontWeight="medium"
                        htmlFor="email"
                      >
                        Email
                      </FormLabel>
                      <Input {...field} placeholder="Seu email" />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="password" validate={validatePassword}>
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      id="password"
                      isInvalid={form.errors.password && form.touched.password}
                    >
                      <FormLabel
                        fontSize="lg"
                        fontWeight="medium"
                        htmlFor="password"
                      >
                        Senha
                      </FormLabel>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Sua senha"
                      />
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Btn
                  w="50%"
                  border="1px solid"
                  borderColor="gray.500"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Enviar
                </Btn>
                <Text>
                  Ainda não possui uma conta?{' '}
                  <NextLink href="/register" passHref>
                    <Link color="primary.light" filter="brightness(2)">
                      Registre-se
                    </Link>
                  </NextLink>
                </Text>
              </VStack>
            </Form>
          )}
        </Formik>
      </MainContainer>
    </>
  );
};

export default LoginPage;
