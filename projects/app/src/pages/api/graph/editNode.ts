import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();

    const { name, type, id, oldType } = req.body as {
      name: string;
      type: string;
      oldType: string;
      id: string;
    };

    const sameNameNode = await session.run(
      `MATCH (n:${type} {name: $name})
        RETURN n`,
      { type, name, id }
    );
    if (sameNameNode.records.length) {
      jsonRes(res, {
        code: 500,
        error: '节点重复'
      });
    }

    const result = await session.run(
      `MATCH (n:${oldType} {id: $id})
        SET n.name = $name
        ${
          oldType
            ? `SET n:${type}
              REMOVE n:${oldType}`
            : ''
        }
        RETURN n`,
      { type, name, id }
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
