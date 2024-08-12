import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import { connectToDatabase } from '@/service/mongo';
import { UserStatusEnum } from '@fastgpt/global/support/user/constant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { username = '', status = null } =
      (req?.query as {
        username: string;
        status: UserStatusEnum;
      }) || {};
    const users = await MongoUser.find({
      username: { $regex: username, $options: 'i' },
      ...(status ? { status } : {})
    }).sort({ createTime: -1 });
    jsonRes(res, {
      data: {
        users: users.map(({ _id, username, avatar, timezone, createTime, status }) => ({
          _id,
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
