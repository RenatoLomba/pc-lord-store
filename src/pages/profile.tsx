import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React, { useRef, useState } from 'react';
import nookies from 'nookies';
import { MainContainer } from '../components/ui/main-container';
import { APP_NAME } from '../utils/constants';
import { getError } from '../utils/get-error';
import { request } from '../utils/request';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Sidebar } from '../components/ui/sidebar';
import { Card } from '../components/ui/card';
import { Title } from '../components/ui/title';
import { Field, Form, Formik } from 'formik';
import validations, {
  validateEmail,
  validatePassword,
  validateRequiredField,
} from '../utils/validators';
import { Btn } from '../components/ui/btn';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/ui/loading';
import { useRouter } from 'next/dist/client/router';

type User = {
  name: string;
  email: string;
  _id: string;
};

type ProfilePageProps = {
  user: User;
};

const ProfilePage: NextPage<ProfilePageProps> = ({ user }) => {
  const router = useRouter();
  const toast = useToast();
  const { loginUser } = useAuth();
  const passwordRef = useRef<string>();
  const [isLoading, setIsLoading] = useState(false);

  const confirmPasswordValidator = (value: string) => {
    let error = '';
    const passwordsAreEqual =
      document.querySelector<HTMLInputElement>('#password')?.value === value;
    error = !passwordsAreEqual ? 'Senhas diferentes' : '';

    return error;
  };

  const formSubmitHandler = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    setIsLoading(true);

    try {
      const { data } = await request.put('auth/update', { ...values });
      loginUser(data.user, data.token);

      router.replace('/profile?success=Informações atualizadas');

      toast({
        title: 'Sucesso',
        description: 'Informações atualizadas',
        status: 'success',
        isClosable: true,
      });
    } catch (ex: any) {
      toast({
        title: ex.response?.data?.error || 'Erro interno',
        description: getError(ex),
        status: 'error',
        variant: 'solid',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {APP_NAME} - Perfil de {user?.name}
        </title>
      </Head>
      <MainContainer>
        <Grid
          gridGap="2"
          h="100%"
          templateColumns={{ base: '1fr', lg: '1fr 3fr' }}
        >
          <Box>
            <Sidebar
              tabs={[
                { href: '/profile', isActive: true, name: 'Perfil' },
                {
                  href: '/order_history',
                  isActive: false,
                  name: 'Histórico de compras',
                },
              ]}
            />
          </Box>
          <Card>
            <Title alignSelf="flex-start">Perfil</Title>
            <Formik
              onSubmit={formSubmitHandler}
              initialValues={{
                email: user.email,
                password: '',
                name: user.name,
              }}
            >
              {(props) => (
                <Form
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <VStack
                    gridGap="3"
                    w={{ base: '90%', sm: '80%', md: '70%', lg: '60%' }}
                  >
                    <Field
                      name="name"
                      validate={(v: string) =>
                        validations(v, 'Nome', validateRequiredField)
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="name"
                          isInvalid={form.errors.name && form.touched.name}
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="name"
                          >
                            Nome
                          </FormLabel>
                          <Input {...field} placeholder="Seu nome" />
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field
                      name="email"
                      validate={(v: string) =>
                        validations(
                          v,
                          'Email',
                          validateRequiredField,
                          validateEmail,
                        )
                      }
                    >
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
                          <FormErrorMessage>
                            {form.errors.email}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field
                      name="password"
                      validate={(v: string) =>
                        validations(
                          v,
                          'Senha',
                          validateRequiredField,
                          validatePassword,
                        )
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="password"
                          isInvalid={
                            form.errors.password && form.touched.password
                          }
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="password"
                          >
                            Senha
                          </FormLabel>
                          <Input
                            onChange={(e) =>
                              (passwordRef.current = e.target.value)
                            }
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
                    <Field
                      name="confirmPassword"
                      validate={(v: string) =>
                        validations(
                          v,
                          'Confirmar senha',
                          validateRequiredField,
                          validatePassword,
                          confirmPasswordValidator,
                        )
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="confirmPassword"
                          isInvalid={
                            form.errors.confirmPassword &&
                            form.touched.confirmPassword
                          }
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="confirmPassword"
                          >
                            Confirmar senha
                          </FormLabel>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Sua senha"
                          />
                          <FormErrorMessage>
                            {form.errors.confirmPassword}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    {isLoading && <Loading />}
                    <Btn
                      w="50%"
                      border="1px solid"
                      borderColor="gray.500"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Enviar
                    </Btn>
                  </VStack>
                </Form>
              )}
            </Formik>
          </Card>
        </Grid>
      </MainContainer>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: `/login?redirect=profile`,
        permanent: false,
      },
    };
  }

  try {
    const { data } = await request.get('auth', {
      headers: { Authorization: 'Bearer ' + USER_TOKEN },
    });

    if (!data.isValid) {
      return {
        redirect: {
          destination: '/login?message=Usuário inválido&redirect=profile',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: {
          name: data.user.name,
          email: data.user.email,
          _id: data.user._id,
        },
      },
    };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default ProfilePage;
