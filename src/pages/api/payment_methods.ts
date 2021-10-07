// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getError } from '../../utils/get-error';
import { reqFromMercadoPago } from '../../utils/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { data } = await reqFromMercadoPago('v1/payment_methods');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: getError(err) });
  }
}
