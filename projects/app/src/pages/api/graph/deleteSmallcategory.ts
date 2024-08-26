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
      `MATCH (n:event {category_small_sym: $id})
      RETURN n`,
      { id }
    );
    if (relatedNode.records.length) {
      jsonRes(res, {
        code: 501,
        error: '被事件关联，无法删除'
      });
      return;
    }

    const relation = await session.run(
      `MATCH (n:event)-[r:ASSOCIATED_TO]-(m:smallcategory {id: $id})
        RETURN r`,
      { id }
    );
    if (relation.records.length) {
      jsonRes(res, {
        code: 501,
        error: '被事件关联，无法删除'
      });
      return;
    }

    await session.run(
      `MATCH (n:smallcategory {id: $id})-[r:BELONGS_TO]-(m:bigcategory)
       DELETE r`,
      { id }
    );

    await session.run(
      `MATCH (n:smallcategory  {id: $id})
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
