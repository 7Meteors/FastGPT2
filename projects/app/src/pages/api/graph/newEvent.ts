// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';
import { Date } from 'neo4j-driver-core/lib/temporal-types.js';
import { toNumber } from 'neo4j-driver-core/lib/integer.js';

import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const { address, category_small_sym, issue, urgency_sym } = req.body as {
      address: string;
      category_small_sym?: string;
      issue: string;
      urgency_sym: string;
    };

    // const sameIdNode = await session.run(
    //   `MATCH (n:smallcategory {id: $id})
    //   RETURN n`,
    //   { id, name }
    // );
    // if (sameIdNode.records.length) {
    //   jsonRes(res, {
    //     code: 501,
    //     error: '编号重复'
    //   });
    //   return;
    // }
    // const sameNameNode = await session.run(
    //   `MATCH (n:smallcategory {name: $name})
    //   RETURN n`,
    //   { id, name }
    // );
    // if (sameNameNode.records.length) {
    //   jsonRes(res, {
    //     code: 501,
    //     error: '名称重复'
    //   });
    //   return;
    // }
    const nowDate = dayjs();
    const result = await session.run(
      `CREATE (n:event  {issue: $issue, address: $address, urgency_sym: $urgency_sym, category_small_sym: $category_small_sym, created_at:$created_at})
       RETURN n`,
      {
        address,
        category_small_sym,
        issue,
        urgency_sym,
        created_at: new Date(nowDate.get('year'), nowDate.get('month') + 1, nowDate.get('date'))
      }
    );

    const id = toNumber(result.records[0].get('n').identity);

    if (category_small_sym) {
      await session.run(
        `MATCH (small:smallcategory {id: $category_small_sym})
         MATCH (ev:event) WHERE id(ev)= $id
		     MERGE (ev)-[:ASSOCIATED_TO]->(small)`,
        {
          id,
          address,
          category_small_sym,
          issue,
          urgency_sym
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
