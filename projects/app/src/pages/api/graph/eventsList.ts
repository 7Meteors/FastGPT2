// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';
import { toNumber } from 'neo4j-driver-core/lib/integer.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const { name, type } = req.query as {
      name?: string;
      type?: string;
    };
    const result = await session.run(`
      MATCH (n:event)
      RETURN n
      ORDER BY n.created_at DESC`);
    jsonRes(res, {
      data: {
        total: result.records.length,
        data: result.records.map((r: any) => {
          const {
            identity,
            properties: {
              address,
              category_big_sym,
              issue,
              category_small_sym,
              created_at,
              id,
              urgency_sym,
              status
            }
          } = r.get('n');

          return {
            id: toNumber(identity),
            address,
            issue,
            category_big_sym,
            category_small_sym,
            created_at:
              created_at && created_at !== 'NULL' ? created_at?.toStandardDate() : '' || '',
            urgency_sym,
            status
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
