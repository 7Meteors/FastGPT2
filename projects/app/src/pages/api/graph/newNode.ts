import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();

    const {
      name,
      type,
      content = '',
      address = '',
      status = ''
    } = req.body as {
      name: string;
      type: string;
      content?: string;
      address?: string;
      status?: string;
    };

    const sameNameNode = await session.run(
      `MATCH (n:${type} {name: "${name}"})
      RETURN n`,
      { type, name }
    );
    if (sameNameNode.records.length) {
      jsonRes(res, {
        code: 500,
        error: '名称重复'
      });
    }

    const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const result = await session.run(
      `CREATE (n:${type} {name: "${name}", createTime: $createTime ${content ? `,content: "${content}"` : ''} ${address ? `,address: "${address}"` : ''} ${status ? `,status: "${status}"` : ''}})
       RETURN n`,
      { type, name, createTime }
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
