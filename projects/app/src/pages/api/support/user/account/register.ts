import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import { connectToDatabase } from '@/service/mongo';
import { MongoTeam } from '@fastgpt/service/support/user/team/teamSchema';
import { MongoTeamMember } from '@fastgpt/service/support/user/team/teamMemberSchema';
import { UserStatusEnum } from '@fastgpt/global/support/user/constant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { username, code, inviterId, password } = req.body as {
      username: string;
      code?: string;
      password: string;
      inviterId?: string;
    };
    const sameNameUser = await MongoUser.findOne({
      username
    });

    if (sameNameUser) {
      jsonRes(res, { code: 500, error: '当前用户名已存在' });
    } else {
      const { _id } = await MongoUser.create({
        username,
        password,
        status: UserStatusEnum.forbidden
      });
      const { _id: rootUserId } = await MongoUser.findOne({
        username: 'root'
      });
      const { _id: defaultTeamId } = await MongoTeam.findOne({
        ownerId: rootUserId
      });
      await MongoTeamMember.create({
        teamId: defaultTeamId,
        userId: _id,
        role: 'member',
        defaultTeam: true
      });
      jsonRes(res, { data: { username } });
    }
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
