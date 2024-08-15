import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { request } from 'http';
import { GraphUrl } from '@fastgpt/service/common/system/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // await connectToDatabase();
    console.log('GraphUrl:', GraphUrl);

    const { path = [], ...query } = req.query as any;
    console.log('path:', path, query);

    const requestPath = `/${path?.join('/')}?${new URLSearchParams(query).toString()}`;
    console.log('requestPath', requestPath);

    if (!GraphUrl) {
      throw new Error(`未配置图数据服务链接: ${path}`);
    }

    const parsedUrl = new URL(GraphUrl);
    delete req.headers?.rootkey;

    console.log('parsedUrl:', parsedUrl);

    const requestResult = request({
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: requestPath,
      method: req.method,
      headers: req.headers
    });
    console.log('requestResult:', requestResult);

    req.pipe(requestResult);

    requestResult.on('response', (response) => {
      console.log('response:', response);

      Object.keys(response.headers).forEach((key) => {
        // @ts-ignore
        res.setHeader(key, response.headers[key]);
      });
      response.statusCode && res.writeHead(response.statusCode);
      response.pipe(res);
    });

    requestResult.on('error', (e) => {
      res.send(e);
      res.end();
    });
  } catch (error) {
    jsonRes(res, {
      code: 500,
      error
    });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};
