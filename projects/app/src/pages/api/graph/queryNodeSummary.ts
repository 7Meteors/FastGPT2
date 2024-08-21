import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { driver } from '@fastgpt/service/common/neo4j/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const session = driver.session();

    const statusCountsResult = await session.run(`
        MATCH (e)
        WHERE e.status IN ['caseClosed', 'caseRefused', 'caseToBeFiled']
        RETURN e.status AS status, COUNT(e) AS count
        ORDER BY status`);
    const totalCountResult = await session.run(
      `MATCH (e:event)
      RETURN COUNT(e) AS totalCount`
    );

    const statusCounts: Record<string, number> = {};
    statusCountsResult.records.forEach((record: { get: any }) => {
      statusCounts[record.get('status')] = record.get('count')?.low || 0;
    });

    statusCounts.total = totalCountResult.records[0].get('totalCount').low;

    jsonRes(res, {
      data: {
        data: statusCounts
      }
    });
    session.close();
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
