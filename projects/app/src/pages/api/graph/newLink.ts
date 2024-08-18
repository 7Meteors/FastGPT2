import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();

    const { source, target } = req.body as {
      source: {
        label: string;
        type: string;
        value: string;
      };
      target: {
        label: string;
        type: string;
        value: string;
      };
    };
    const relationshipType = 'belong_to';

    if (!source || !target || !relationshipType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sameLink = await session.run(
      `MATCH (a:${source.type} {name:"${source.label}"}), (b:${target.type} {name:"${target.label}"})
       MATCH (a)-[r:${relationshipType}]->(b)
       RETURN r`,
      { source, target }
    );
    const reverseLink = await session.run(
      `MATCH (a:${target.type} {name:"${target.label}"}), (b:${source.type} {name:"${source.label}"})
       MATCH (a)-[r:${relationshipType}]->(b)
       RETURN r`,
      { source, target }
    );
    if (sameLink.records?.length || reverseLink.records?.length) {
      jsonRes(res, {
        code: 500,
        error: '已存在相同关联或反向关联'
      });
    }

    const result = await session.run(
      `MATCH (a:${source.type} {name:"${source.label}"}), (b:${target.type} {name:"${target.label}"})
       CREATE (a)-[r:${relationshipType}]->(b)
       RETURN r`,
      { source, target }
    );

    jsonRes(res, { data: result });
    session.close();
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
