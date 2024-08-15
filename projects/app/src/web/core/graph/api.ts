import { POST } from '@/web/common/api/request';
import type { DatasetListItemType } from '@fastgpt/global/core/dataset/type.d';
import type { GetDatasetListBody } from '@/pages/api/core/dataset/list';

/* ======================== dataset ======================= */
export const getNodes = (data: GetDatasetListBody) =>
  POST<DatasetListItemType[]>(`/graph/nodesList`);
