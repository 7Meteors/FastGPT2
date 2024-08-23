// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const {
      name,
      id,
      content = '',
      unit = '',
      department = '',
      category_big_sym = ''
    } = req.body as {
      name: string;
      id: string;
      content?: string;
      unit?: string;
      department?: string;
      category_big_sym?: string;
    };

    const sameIdNode = await session.run(
      `MATCH (n:smallcategory {id: $id})
      RETURN n`,
      { id, name }
    );
    if (sameIdNode.records.length) {
      jsonRes(res, {
        code: 501,
        error: '编号重复'
      });
      return;
    }
    const sameNameNode = await session.run(
      `MATCH (n:smallcategory {name: $name})
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

    const result = await session.run(
      `CREATE (n:smallcategory  {name: $name, id: $id, content: $content, unit: $unit, department: $department, category_big_sym: $category_big_sym})
       RETURN n`,
      { id, name, content, unit, department, category_big_sym }
    );

    if (category_big_sym) {
      await session.run(
        `MATCH (small:smallcategory {id: $id}), (big:bigcategory {id:$category_big_sym })
		     MERGE (small)-[:BELONGS_TO]->(big)`,
        { id, name, content, unit, department, category_big_sym }
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
