// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();
  try {
    const bigCategories = await session.run(`
        MATCH (n:bigcategory)
        RETURN n`);
    const smallCategories = await session.run(`
        MATCH (n:smallcategory)
        RETURN n`);

    const bigCategoriesMap = {};
    bigCategories.records.forEach((r: any) => {
      const {
        properties: { id, name }
      } = r.get('n');
      bigCategoriesMap[id] = {
        id,
        name,
        text: name
      };
    });

    const smallCategoriesMap = {};
    smallCategories.records.forEach((r: any) => {
      const {
        properties: { id, name, content, unit, department, category_big_sym }
      } = r.get('n');
      smallCategoriesMap[id] = {
        id,
        name,
        text: name,
        content,
        unit,
        department,
        category_big_sym
      };
    });

    jsonRes(res, {
      data: {
        data: {
          bigCategories: bigCategoriesMap,
          smallCategories: smallCategoriesMap
        }
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  } finally {
    session.close();
  }
}
