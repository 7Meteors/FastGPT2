import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();
    const result = await session.run(`
      MATCH (a)-[r]->(b) 
      RETURN a, r, b`);
    console.log(result);
    jsonRes(res, {
      data: {
        data: result.records.map((r: { get: (arg0: string) => any }) => ({
          r: r.get('r'),
          a: r.get('a'),
          b: r.get('b')
        }))
      }
    });
    session.close();
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
