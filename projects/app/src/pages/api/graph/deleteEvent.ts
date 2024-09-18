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

    await session.run(
      `MATCH (ev:event) WHERE id(ev)= $id
       MATCH (ev)-[oldRel:ASSOCIATED_TO]->(small:smallcategory)
		   DELETE oldRel`,
      { id: Number(id) }
    );

    await session.run(
      `MATCH (ev:event) WHERE id(ev)= $id
       DELETE ev`,
      { id: Number(id) }
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
