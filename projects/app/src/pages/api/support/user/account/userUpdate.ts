import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { UserUpdateParams } from '@/types/user';
import { getAIApi, openaiBaseUrl } from '@fastgpt/service/core/ai/config';
import { connectToDatabase } from '@/service/mongo';
import { MongoTeamMember } from '@fastgpt/service/support/user/team/teamMemberSchema';

/* update user info */
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    const { _id, password, status } = req.body as UserUpdateParams;

    const { tmbId } = await authCert({ req, authToken: true });
    const tmb = await MongoTeamMember.findById(tmbId);
    if (!tmb) {
      throw new Error('can not find it');
    }
    // 更新对应的记录
    await MongoUser.updateOne(
      {
        _id
      },
      {
        ...(password && { password }),
        ...(status && { status })
      }
    );
    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
