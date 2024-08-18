import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();
    const { name, type } = req.query as {
      name?: string;
      type?: string;
    };
    const result = await session.run(`
      MATCH (n${type ? `:${type}` : ''}) 
      ${name ? `WHERE n.name =~ '.*${name}.*'` : ''}
      RETURN n
      ORDER BY n.createTime DESC`);
    jsonRes(res, {
      data: {
        total: result.records.length,
        data: result.records.map((r: { get: (arg0: string) => any }) => {
          const node = r.get('n');
          return {
            id: node.elementId,
            type: node.labels[0],
            ...node.properties
          };
        })
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
