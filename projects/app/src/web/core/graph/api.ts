import { GET, POST, DELETE } from '@/web/common/api/request';
import type { DatasetListItemType } from '@fastgpt/global/core/dataset/type.d';

type POSTNewNodeBody = {
  id?: number;
  name: string;
  oldType?: string;
  type: string;
};

export const getNodes = (params?: { name?: string; type?: string }) =>
  GET<{ data: any[] }>(`/graph/nodesList`, params);

export const getEvents = () => GET<{ data: any[] }>(`/graph/eventsList`);
export const bigcategoryList = () => GET<{ data: any[] }>(`/graph/bigcategoryList`);
export const smallcategoryList = () => GET<{ data: any[] }>(`/graph/smallcategoryList`);
export const getCategoriesMap = () => GET<{ data: any[] }>(`/graph/categoriesMap`);

export const queryEventSummary = () => GET(`/graph/queryEventSummary`);
export const queryNodeSummary = () => GET(`/graph/queryNodeSummary`);

export const getLinks = (params?: any) => GET<{ data: any[] }>(`/graph/linksList`, params);

export const newNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/newNode`, data);

export const newBigcategory = (data: any) => POST(`/graph/newBigcategory`, data);
export const newSmallcategory = (data: any) => POST(`/graph/newSmallcategory`, data);
export const editBigcategory = (data: any) => POST(`/graph/editBigcategory`, data);
export const editSmallcategory = (data: any) => POST(`/graph/editSmallcategory`, data);

export const editNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/editNode`, data);

export const deleteSmallcategory = (data: { id: string }) =>
  DELETE(`/graph/deleteSmallcategory`, data);
export const deleteBigcategory = (data: { id: string }) => DELETE(`/graph/deleteBigcategory`, data);

export const newLink = (data: any) => POST<DatasetListItemType[]>(`/graph/newLink`, data);

export const deleteLink = () => POST<DatasetListItemType[]>(`/graph/deleteLink`);
