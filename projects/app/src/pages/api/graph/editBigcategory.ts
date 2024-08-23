// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();

  try {
    const { name, id, oldName } = req.body as {
      oldName: string;
      name: string;
      id: string;
    };

    if (oldName) {
      const sameNameNode = await session.run(
        `MATCH (n:bigcategory {name: $name})
        RETURN n`,
        { id, name }
      );
      if (sameNameNode.records.length) {
        jsonRes(res, {
          code: 501,
          error: '名称重复'
        });
        return;
      }
    }

    await session.run(
      `MATCH (n:bigcategory {id: $id})
	      SET n.name = $name`,
      { id, name }
    );

    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  } finally {
    session.close();
  }
}
