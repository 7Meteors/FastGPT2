// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';
import { toNumber } from 'neo4j-driver-core/lib/integer.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (n)
      RETURN n`);
    jsonRes(res, {
      data: {
        total: result.records.length,
        data: result.records.map((r: { get: (arg0: string) => any }) => {
          const node = r.get('n');
          return {
            ...node.properties,
            name: node.properties?.name || node.properties?.issue,
            type: node.labels[0],
            id: `${node.labels[0]}-${node.labels[0] === 'event' ? toNumber(node.identity) : node?.properties?.id}`
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
