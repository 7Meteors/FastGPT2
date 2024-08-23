// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const { name, type } = req.query as {
      name?: string;
      type?: string;
    };
    const result = await session.run(`
      MATCH (n:bigcategory)
      RETURN n`);
    jsonRes(res, {
      data: {
        data: result.records.map((r: any) => {
          const {
            properties: { id, name }
          } = r.get('n');
          return {
            id,
            name
          };
        })
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  } finally {
    session.close();
  }
}
