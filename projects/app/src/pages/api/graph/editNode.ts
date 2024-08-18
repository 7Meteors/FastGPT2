import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();

    const {
      name,
      type,
      id,
      oldName,
      content = '',
      address = ''
    } = req.body as {
      name: string;
      type: string;
      oldName: string;
      id: string;
      content?: string;
      address?: string;
    };

    if (oldName) {
      const sameNameNode = await session.run(
        `MATCH (n:${type} {name: "${name}"})
        RETURN n`,
        { type, name, id }
      );
      if (sameNameNode.records.length) {
        jsonRes(res, {
          code: 500,
          error: '节点重复'
        });
      }
    }

    const result = await session.run(
      `MATCH (n:${type} {id: $id})  
      ${oldName ? `SET n.name = "${name}"` : ''}
      ${content ? `SET n.content = ${content}` : ''}
      ${address ? `SET n.address = ${address}` : ''}
        RETURN n`,
      { type, name, id }
    );

    console.log(result);

    jsonRes(res, {
      data: result.records
    });
    session.close();
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
