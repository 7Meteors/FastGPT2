import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();

    // 执行Cypher查询
    const result = await session.run('MATCH (n) RETURN n LIMIT 10');
    console.log('result:', result);

    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
