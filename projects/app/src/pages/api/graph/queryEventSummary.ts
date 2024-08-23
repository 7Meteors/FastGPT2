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
    const result: any = { urgency: {} };

    const urgencyCountsResult = await session.run(`
        MATCH (e:event)
        WHERE e.urgency_sym IN ['yz', 'yb', 'jy', 'qd']
        RETURN e.urgency_sym AS urgency_sym, COUNT(e) AS count
        ORDER BY urgency_sym`);
    urgencyCountsResult.records.forEach((record: { get: any }) => {
      result.urgency[record.get('urgency_sym')] = toNumber(record.get('count')) || 0;
    });

    const totalCountResult = await session.run(
      `MATCH (e:event)
      RETURN COUNT(e) AS totalCount`
    );
    result.total = toNumber(totalCountResult.records[0].get('totalCount'));

    const lastMonthDate = dayjs().subtract(1, 'month');
    const startDate = new Date(lastMonthDate.get('year'), lastMonthDate.get('month') + 1, 1);
    const endDate = new Date(dayjs().get('year'), dayjs().get('month') + 1, 1);

    const lastMonthCountResult = await session.run(
      `MATCH (n:event)
      WHERE n.created_at >= $startDate AND n.created_at < $endDate
      RETURN COUNT(n) AS lastMonthCount`,
      {
        startDate,
        endDate
      }
    );
    result.lastMonth = toNumber(lastMonthCountResult.records[0].get('lastMonthCount'));

    jsonRes(res, {
      data: {
        data: result
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
