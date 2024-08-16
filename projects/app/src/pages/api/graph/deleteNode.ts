import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();

    const { name, type } = req.body as {
      name: string;
      type: string;
    };

    const result = await session.run(
      `MATCH (n:${type} {name: $name})
       DETACH DELETE n`,
      { type, name }
    );

    jsonRes(res, {
      data: result.records.map((r: { get: (arg0: string) => any }) => {
        const node = r.get('n');
        return {
          id: node.elementId,
          name: node.properties?.name,
          type: node.labels[0]
        };
      })
    });
    session.close();
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}