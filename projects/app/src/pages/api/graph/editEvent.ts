// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const { id, address, category_small_sym, issue, urgency_sym, old_category_small_sym } =
      req.body as {
        address: string;
        category_small_sym?: string;
        old_category_small_sym?: string;
        issue: string;
        urgency_sym: string;
        id: number;
      };

    if (old_category_small_sym && old_category_small_sym !== category_small_sym) {
      await session.run(
        `MATCH (ev:event) WHERE id(ev)= $id
         MATCH (ev)-[oldRel:ASSOCIATED_TO]->(small:smallcategory)
         DELETE oldRel`,
        { id }
      );
    }

    const toUpdateKeys = ['address', 'category_small_sym', 'issue', 'urgency_sym'];

    await session.run(
      `MATCH (n:event) WHERE id(n)= $id
	      SET ${toUpdateKeys.map((key) => `n.${key} = $${key}`).join(', ')}`,
      { id, address, category_small_sym, issue, urgency_sym, old_category_small_sym }
    );

    if (category_small_sym && old_category_small_sym !== category_small_sym) {
      await session.run(
        `MATCH (small:smallcategory {id: $category_small_sym})
         MATCH (ev:event) WHERE id(ev)= $id
		     MERGE (ev)-[:ASSOCIATED_TO]->(small)`,
        {
          id,
          address,
          category_small_sym,
          issue,
          urgency_sym,
          old_category_small_sym
        }
      );
    }

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
