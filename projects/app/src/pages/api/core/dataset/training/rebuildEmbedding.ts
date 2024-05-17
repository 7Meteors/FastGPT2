import { NextAPI } from '@/service/middleware/entry';
import { authDataset } from '@fastgpt/service/support/permission/auth/dataset';
import { mongoSessionRun } from '@fastgpt/service/common/mongo/sessionRun';
import { MongoDataset } from '@fastgpt/service/core/dataset/schema';
import { MongoDatasetData } from '@fastgpt/service/core/dataset/data/schema';
import { MongoDatasetTraining } from '@fastgpt/service/core/dataset/training/schema';
import { createTrainingUsage } from '@fastgpt/service/support/wallet/usage/controller';
import { UsageSourceEnum } from '@fastgpt/global/support/wallet/usage/constants';
import { getLLMModel, getVectorModel } from '@fastgpt/service/core/ai/model';
import { TrainingModeEnum } from '@fastgpt/global/core/dataset/constants';
import { ApiRequestProps, ApiResponseType } from '@fastgpt/service/type/next';

export type rebuildEmbeddingBody = {
  datasetId: string;
  vectorModel: string;
};

export type Response = {};

async function handler(
  req: ApiRequestProps<rebuildEmbeddingBody>,
  res: ApiResponseType<any>
): Promise<Response> {
  const { datasetId, vectorModel } = req.body;

  const { teamId, tmbId, dataset } = await authDataset({
    req,
    authToken: true,
    authApiKey: true,
    datasetId,
    per: 'owner'
  });

  // check vector model
  if (!vectorModel || dataset.vectorModel === vectorModel) {
    return Promise.reject('vectorModel 不合法');
  }

  // check rebuilding or training
  const [rebuilding, training] = await Promise.all([
    MongoDatasetData.findOne({ teamId, datasetId, rebuilding: true }),
    MongoDatasetTraining.findOne({ teamId, datasetId })
  ]);

  if (rebuilding || training) {
    return Promise.reject('数据集正在训练或者重建中，请稍后再试');
  }

  const { billId } = await createTrainingUsage({
    teamId,
    tmbId,
    appName: '切换索引模型',
    billSource: UsageSourceEnum.training,
    vectorModel: getVectorModel(dataset.vectorModel)?.name,
    agentModel: getLLMModel(dataset.agentModel)?.name
  });

  // update vector model and dataset.data rebuild field
  await mongoSessionRun(async (session) => {
    await MongoDataset.findByIdAndUpdate(
      datasetId,
      {
        vectorModel
      },
      { session }
    );
    await MongoDatasetData.updateMany(
      {
        teamId,
        datasetId
      },
      {
        $set: {
          rebuilding: true
        }
      },
      {
        session
      }
    );
  });

  // get 10 init dataset.data
  const arr = new Array(10).fill(0);
  for await (const _ of arr) {
    await mongoSessionRun(async (session) => {
      const data = await MongoDatasetData.findOneAndUpdate(
        {
          teamId,
          datasetId,
          rebuilding: true
        },
        {
          $unset: {
            rebuilding: null
          },
          updateTime: new Date()
        },
        {
          session
        }
      ).select({
        _id: 1,
        collectionId: 1
      });

      if (data) {
        await MongoDatasetTraining.create(
          [
            {
              teamId,
              tmbId,
              datasetId,
              collectionId: data.collectionId,
              billId,
              mode: TrainingModeEnum.chunk,
              model: vectorModel,
              q: '1',
              dataId: data._id
            }
          ],
          {
            session
          }
        );
      }
    });
  }

  return {};
}

export default NextAPI(handler);
