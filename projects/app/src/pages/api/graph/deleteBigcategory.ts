// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const { id } = req.query as {
      id: string;
    };

    const relatedNode = await session.run(
      `MATCH (n:smallcategory {category_big_sym: $id})
      RETURN n`,
      { id }
    );
    if (relatedNode.records.length) {
      jsonRes(res, {
        code: 501,
        error: '被小类关联，无法删除'
      });
      return;
    }

    await session.run(
      `MATCH (n:bigcategory  {id: $id})
       DELETE n`,
      { id }
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
