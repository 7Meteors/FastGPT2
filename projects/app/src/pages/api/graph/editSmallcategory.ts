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
      oldName,
      content = '',
      unit = '',
      department = '',
      category_big_sym = '',
      old_category_big_sym = ''
    } = req.body as {
      name: string;
      id: string;
      content?: string;
      unit?: string;
      department?: string;
      oldName: string;
      category_big_sym?: string;
      old_category_big_sym?: string;
    };

    if (oldName) {
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
    }

    if (old_category_big_sym && old_category_big_sym !== category_big_sym) {
      await session.run(
        `MATCH (small:smallcategory {id: $id})-[oldRel:BELONGS_TO]-(m:bigcategory)
         DELETE oldRel`,
        { id, old_category_big_sym }
      );
    }

    const toUpdateKeys = Object.keys(req.body).filter(
      (key) => key !== 'id' && key !== 'oldName' && key !== 'old_category_big_sym'
    );

    await session.run(
      `MATCH (n:smallcategory {id: $id})
	      SET ${toUpdateKeys.map((key) => `n.${key} = $${key}`).join(', ')}`,
      { name, id, oldName, content, unit, department, category_big_sym, old_category_big_sym }
    );

    if (category_big_sym && old_category_big_sym !== category_big_sym) {
      await session.run(
        `MATCH (small:smallcategory {id: $id})
         MATCH (newBig:bigcategory {id: $category_big_sym})
         MERGE (small)-[:BELONGS_TO]->(newBig)`,
        {
          name,
          id,
          oldName,
          content,
          unit,
          department,
          category_big_sym,
          old_category_big_sym
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
