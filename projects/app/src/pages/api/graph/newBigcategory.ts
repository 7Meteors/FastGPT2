import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const { name, id } = req.body as {
      name: string;
      id: string;
    };

    const sameIdNode = await session.run(
      `MATCH (n:bigcategory {id: $id})
      RETURN n`,
      { id, name }
    );
    if (sameIdNode.records.length) {
      jsonRes(res, {
        code: 501,
        error: '编号重复'
      });
      return;
    }
    const sameNameNode = await session.run(
      `MATCH (n:bigcategory {name: $name})
      RETURN n`,
      { id, name }
    );
    if (sameNameNode.records.length) {
      jsonRes(res, {
        code: 501,
        error: '名称重复'
      });
      return;
    }

    await session.run(
      `CREATE (n:bigcategory  {name: $name, id: $id})
       RETURN n`,
      { id, name }
    );
    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  } finally {
    session.close();
  }
}
