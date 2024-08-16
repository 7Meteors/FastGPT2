import { GET, POST, DELETE } from '@/web/common/api/request';
import type { DatasetListItemType } from '@fastgpt/global/core/dataset/type.d';

type POSTNewNodeBody = {
  name: string;
  type: string;
};

export const getNodes = () => GET<DatasetListItemType[]>(`/graph/nodesList`);

export const getLinks = () => GET<DatasetListItemType[]>(`/graph/linksList`);

export const newNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/newNode`, data);

export const newLink = () => POST<DatasetListItemType[]>(`/graph/newLink`);

export const deleteNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/deleteNode`, data);

export const deleteLink = () => POST<DatasetListItemType[]>(`/graph/deleteLink`);
