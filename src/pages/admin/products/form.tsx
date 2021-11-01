import React, { ChangeEvent, MutableRefObject, useRef, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Icon,
  Input,
  useToast,
  VStack,
  Image,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

import { MainContainer } from '../../../components/ui/main-container';
import { APP_NAME } from '../../../utils/constants';
import { getError } from '../../../utils/get-error';
import { request } from '../../../utils/request';
import { Card } from '../../../components/ui/card';
import { Title } from '../../../components/ui/title';
import validations, { validateRequiredField } from '../../../utils/validators';
import { Btn } from '../../../components/ui/btn';
import { Loading } from '../../../components/ui/loading';
import { AdminSidebar } from '../../../components/default/admin-sidebar';
import { MdChevronLeft } from 'react-icons/md';
import { useRouter } from 'next/dist/client/router';

type Product = {
  _id: string;
  name: string;
  price: number;
  priceFormatted: string;
  category: string;
  countInStock: number;
  createdAt: string;
  slug: string;
  brand: string;
  image: string;
  description: string;
};

type ProductFormPageProps = {
  product?: Product;
};

const ProductFormPage: NextPage<ProductFormPageProps> = ({ product }) => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.image || '');
  const { asPath } = router;

  const imageInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const formSubmitHandler = async (
    values: Omit<Product, '_id' | 'priceFormatted' | 'createdAt'>,
  ) => {
    setIsLoading(true);
    const sendData = {
      ...values,
      countInStock: Number(values.countInStock),
      price: Number(values.price),
    };

    try {
      if (product) {
        console.log(values);
        await request.put(`products/${product?._id}`, sendData);

        router.replace(asPath);
      } else {
        const { data } = await request.post<{ slug: string }>('products', {
          ...sendData,
        });

        router.replace(`${asPath}?slug=${data.slug}`);
      }

      toast({
        title: 'Sucesso',
        description: `Produto ${product ? 'atualizado' : 'criado'}`,
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

  const backHandler = () => {
    router.push('/admin/products');
  };

  const uploadHandler = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => void,
  ) => {
    if (!e?.target?.value) return;

    setIsUploading(true);
    const file = e?.target?.files?.[0] as File;
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);

    try {
      const {
        data: { secure_url },
      } = await request.post<{ secure_url: string }>(
        'products/upload',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setFieldValue('image', secure_url);
      setImageUrl(secure_url);

      toast({
        title: 'Sucesso',
        description: 'Upload de imagem realizado com êxito',
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
      setIsUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {APP_NAME} - {product ? 'Editar' : 'Criar'} produto {product?.name}
        </title>
      </Head>
      <MainContainer>
        <Grid
          gridGap="2"
          h="100%"
          templateColumns={{ base: '1fr', lg: '1fr 3fr' }}
        >
          <Box>
            <AdminSidebar tabActive="products" />
          </Box>
          <Card>
            <Btn
              alignSelf="flex-start"
              onClick={backHandler}
              buttonStyle="secondary"
            >
              <Icon as={MdChevronLeft} w={6} h={6} />
            </Btn>
            <Title alignSelf="flex-start">
              {product ? 'Editar' : 'Criar'} produto {product?.name}
            </Title>
            <Formik
              onSubmit={formSubmitHandler}
              initialValues={{
                name: product?.name || '',
                brand: product?.brand || '' || '',
                category: product?.category || '',
                countInStock: product?.countInStock || 1,
                description: product?.description || '',
                image: product?.image || '',
                price: product?.price || 99.99,
                slug: product?.slug || '',
              }}
            >
              {({ setFieldValue, isSubmitting }) => (
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
                          <Input {...field} />
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field
                      name="slug"
                      validate={(v: string) =>
                        validations(v, 'Slug', validateRequiredField)
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="slug"
                          isInvalid={form.errors.slug && form.touched.slug}
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="slug"
                          >
                            Slug
                          </FormLabel>
                          <Input {...field} />
                          <FormErrorMessage>
                            {form.errors.slug}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field
                      name="price"
                      validate={(v: string) =>
                        validations(v, 'Preço', validateRequiredField)
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="price"
                          isInvalid={form.errors.price && form.touched.price}
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="price"
                          >
                            Preço
                          </FormLabel>
                          <Input {...field} />
                          <FormErrorMessage>
                            {form.errors.price}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Flex w="100%" justifyContent="space-between">
                      <Field
                        name="image"
                        validate={(v: string) =>
                          validations(v, 'Imagem', validateRequiredField)
                        }
                      >
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            w="50%"
                            id="image"
                            isInvalid={form.errors.image && form.touched.image}
                          >
                            <FormLabel
                              fontSize="lg"
                              fontWeight="medium"
                              htmlFor="image"
                            >
                              Imagem
                            </FormLabel>
                            <Input
                              opacity="0.5"
                              cursor="not-allowed"
                              ref={imageInputRef}
                              {...field}
                              readOnly
                            />
                            <FormErrorMessage>
                              {form.errors.image}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Image src={imageUrl} w="45%" />
                    </Flex>

                    <Flex w="100%">
                      <Btn
                        buttonStyle="warning"
                        marginRight="6"
                        cursor="pointer"
                        alignSelf="flex-start"
                        as="label"
                      >
                        Upload de Arquivo
                        <input
                          type="file"
                          onChange={(e) => uploadHandler(e, setFieldValue)}
                          hidden
                        />
                      </Btn>
                      {isUploading && <Loading />}
                    </Flex>

                    <Field
                      name="category"
                      validate={(v: string) =>
                        validations(v, 'Categoria', validateRequiredField)
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="category"
                          isInvalid={
                            form.errors.category && form.touched.category
                          }
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="category"
                          >
                            Categoria
                          </FormLabel>
                          <Input {...field} />
                          <FormErrorMessage>
                            {form.errors.category}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field
                      name="brand"
                      validate={(v: string) =>
                        validations(v, 'Marca', validateRequiredField)
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="brand"
                          isInvalid={form.errors.brand && form.touched.brand}
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="brand"
                          >
                            Marca
                          </FormLabel>
                          <Input {...field} />
                          <FormErrorMessage>
                            {form.errors.brand}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field
                      name="countInStock"
                      validate={(v: string) =>
                        validations(v, 'Em estoque', validateRequiredField)
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="countInStock"
                          isInvalid={
                            form.errors.countInStock &&
                            form.touched.countInStock
                          }
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="countInStock"
                          >
                            Em estoque
                          </FormLabel>
                          <Input {...field} />
                          <FormErrorMessage>
                            {form.errors.countInStock}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field
                      name="description"
                      validate={(v: string) =>
                        validations(v, 'Descrição', validateRequiredField)
                      }
                    >
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          id="description"
                          isInvalid={
                            form.errors.description && form.touched.description
                          }
                        >
                          <FormLabel
                            fontSize="lg"
                            fontWeight="medium"
                            htmlFor="description"
                          >
                            Descrição
                          </FormLabel>
                          <Input {...field} />
                          <FormErrorMessage>
                            {form.errors.description}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    {isLoading && <Loading />}
                    <Btn
                      w="50%"
                      border="1px solid"
                      borderColor="gray.500"
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      {product ? 'Atualizar' : 'Criar'} produto
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
  const { resolvedUrl, query } = ctx;

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: `/login?redirect=${resolvedUrl}`,
        permanent: false,
      },
    };
  }

  request.defaults.headers.common.authorization = 'Bearer ' + USER_TOKEN;

  try {
    const { data } = await request.get('auth');

    if (!data?.isValid) {
      return {
        redirect: {
          destination: `/login?message=Usuário inválido&redirect=${resolvedUrl}`,
          permanent: false,
        },
      };
    }

    if (!data?.user?.isAdmin) {
      return {
        redirect: {
          destination: '/?message=Acesso apenas para administradores',
          permanent: false,
        },
      };
    }

    if (query?.slug) {
      const { data: product } = await request.get<Product>(
        `products/${query.slug}`,
      );

      return {
        props: { product },
      };
    } else {
      return { props: {} };
    }
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default ProductFormPage;
