import axios from 'axios';
import {
  API_MERCADO_PAGO_URL,
  API_URL,
  MERCADO_PAGO_ACCESS_TOKEN,
} from './constants';

const request = axios.create({
  baseURL: API_URL,
});

const reqFromApi = axios.create({
  baseURL: '/api',
});

const reqFromMercadoPago = axios.create({
  baseURL: API_MERCADO_PAGO_URL,
  headers: {
    Authorization: 'Bearer ' + MERCADO_PAGO_ACCESS_TOKEN,
  },
});

export { request, reqFromMercadoPago, reqFromApi };
