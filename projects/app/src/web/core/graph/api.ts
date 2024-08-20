import { GET, POST, DELETE } from '@/web/common/api/request';
import type { DatasetListItemType } from '@fastgpt/global/core/dataset/type.d';

type POSTNewNodeBody = {
  id?: string;
  name: string;
  oldType?: string;
  type: string;
};

export const getNodes = (params?: { name?: string; type?: string }) =>
  GET<{ data: any[] }>(`/graph/nodesList`, params);

export const queryEventSummary = () => GET(`/graph/queryEventSummary`);
export const queryNodeSummary = () => GET(`/graph/queryNodeSummary`);

export const getLinks = (params?: any) => GET<{ data: any[] }>(`/graph/linksList`, params);

export const newNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/newNode`, data);

export const editNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/editNode`, data);

export const deleteNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/deleteNode`, data);

export const newLink = (data: any) => POST<DatasetListItemType[]>(`/graph/newLink`, data);

export const deleteLink = () => POST<DatasetListItemType[]>(`/graph/deleteLink`);
