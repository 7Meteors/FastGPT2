// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';
import { toNumber } from 'neo4j-driver-core/lib/integer.js';
import { Date } from 'neo4j-driver-core/lib/temporal-types.js';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();

  try {
    const eventsPieResult = await session.run(`
        MATCH (a:event)-[:ASSOCIATED_TO]->(b:smallcategory)-[:BELONGS_TO]->(c:bigcategory)
        RETURN c.name AS cName, COUNT(a) AS aCount
        `);

    jsonRes(res, {
      data: {
        data: eventsPieResult.records.map((record) => {
          const cName = record.get('cName');
          const aCount = record.get('aCount');
          return {
            name: cName,
            value: toNumber(aCount)
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
