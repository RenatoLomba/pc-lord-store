import type { NextApiRequest, NextApiResponse } from 'next';
import { getError } from '../../utils/get-error';
import { request } from '../../utils/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    const { data } = await request.get('orders', {
      headers: { Authorization: authorization },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: getError(err) });
  }
}
