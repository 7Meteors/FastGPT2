// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';
import { toNumber } from 'neo4j-driver-core/lib/integer.js';
import { Date } from 'neo4j-driver-core/lib/temporal-types.js';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = driver.session();

  try {
    const result: [string, number][] = [];
    const timelineMap = {};
    const timelineCountsResult = await session.run(`
        MATCH (n:event)
        WITH date({year: n.created_at.year, month: n.created_at.month}) AS monthYear, count(n) AS nodeCount
        RETURN monthYear, nodeCount`);
    timelineCountsResult.records.forEach((record: { get: any }) => {
      timelineMap[dayjs(record.get('monthYear')).format('YYYY-MM')] =
        toNumber(record.get('nodeCount')) || 0;
    });
    const nowDate = dayjs().startOf('month');
    let total = 0;
    for (let i = 0; i < 12; i++) {
      const date = nowDate.subtract(i, 'month');
      const m = date.format('YYYY-MM');
      result.unshift([m, timelineMap[m] || 0]);
      total += timelineMap[m] || 0;
    }
    jsonRes(res, {
      data: {
        data: result,
        average: (total / 12).toFixed(2)
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
