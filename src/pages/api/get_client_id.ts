import type { NextApiRequest, NextApiResponse } from 'next';
import { PAYPAL_CLIENT_ID } from '../../utils/constants';
import { getError } from '../../utils/get-error';
import { request } from '../../utils/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'Apenas requisições GET' });
  }

  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ message: 'Rota autorizada apenas para usuários' });
  }

  try {
    const { data } = await request.get('auth', {
      headers: { Authorization: req.headers.authorization },
    });
    if (!data.isValid)
      return res.status(400).json({ message: 'Usuário não autorizado' });

    const clientId = PAYPAL_CLIENT_ID || 'sb';
    return res.status(200).json({ clientId });
  } catch (err) {
    console.error(getError(err));
    return res.status(500).json({ message: getError(err) });
  }
}
