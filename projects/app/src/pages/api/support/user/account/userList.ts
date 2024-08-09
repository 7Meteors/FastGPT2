import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import { connectToDatabase } from '@/service/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const users = await MongoUser.find();
    jsonRes(res, {
      data: {
        users: users.map(({ username, avatar, timezone, createTime, status }) => ({
          username,
          avatar,
          timezone,
          createTime,
          status
        }))
      }
    });
    return;
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
