import type { NextApiRequest, NextApiResponse } from 'next';
import { getError } from '../../utils/get-error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = [
      { id: 'card', name: 'Cartão' },
      { id: 'boleto', name: 'Boleto' },
    ];
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: getError(err) });
  }
}
