import { GET, POST, DELETE } from '@/web/common/api/request';
import type { DatasetListItemType } from '@fastgpt/global/core/dataset/type.d';

type POSTNewNodeBody = {
  id?: string;
  name: string;
  oldType?: string;
  type: string;
};

export const getNodes = () => GET<DatasetListItemType[]>(`/graph/nodesList`);

export const getLinks = () => GET<DatasetListItemType[]>(`/graph/linksList`);

export const newNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/newNode`, data);

export const editNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/editNode`, data);

export const deleteNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/deleteNode`, data);

export const newLink = () => POST<DatasetListItemType[]>(`/graph/newLink`);

export const deleteLink = () => POST<DatasetListItemType[]>(`/graph/deleteLink`);
