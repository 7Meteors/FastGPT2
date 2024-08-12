import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import { connectToDatabase } from '@/service/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { _id } = req.query as {
      _id: string;
    };
    await MongoUser.deleteOne({ _id });
    jsonRes(res, {
      data: {}
    });
    return;
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
