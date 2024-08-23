import { GET, POST, DELETE } from '@/web/common/api/request';
import type { DatasetListItemType } from '@fastgpt/global/core/dataset/type.d';

type POSTNewNodeBody = {
  id?: number;
  name: string;
  oldType?: string;
  type: string;
};

export const getNodes = () => GET<{ data: any[] }>(`/graph/nodesList`);
export const getLinks = () => GET<{ data: any[] }>(`/graph/linksList`);

export const getEvents = () => GET<{ data: any[] }>(`/graph/eventsList`);
export const bigcategoryList = () => GET<{ data: any[] }>(`/graph/bigcategoryList`);
export const smallcategoryList = () => GET<{ data: any[] }>(`/graph/smallcategoryList`);
export const getCategoriesMap = () => GET<{ data: any[] }>(`/graph/categoriesMap`);

export const queryEventSummary = () => GET(`/graph/queryEventSummary`);
export const queryEventTimeline = () => GET(`/graph/queryEventTimeline`);
export const queryEventPieSummary = () => GET(`/graph/queryEventPieSummary`);

export const newEvent = (data: any) => POST(`/graph/newEvent`, data);
export const editEvent = (data: any) => POST(`/graph/editEvent`, data);

export const newBigcategory = (data: any) => POST(`/graph/newBigcategory`, data);
export const newSmallcategory = (data: any) => POST(`/graph/newSmallcategory`, data);
export const editBigcategory = (data: any) => POST(`/graph/editBigcategory`, data);
export const editSmallcategory = (data: any) => POST(`/graph/editSmallcategory`, data);

export const editNode = (data: POSTNewNodeBody) =>
  POST<DatasetListItemType[]>(`/graph/editNode`, data);

export const deleteSmallcategory = (data: { id: string }) =>
  DELETE(`/graph/deleteSmallcategory`, data);
export const deleteBigcategory = (data: { id: string }) => DELETE(`/graph/deleteBigcategory`, data);
export const deleteEvent = (data: { id: string }) => DELETE(`/graph/deleteEvent`, data);

export const newLink = (data: any) => POST<DatasetListItemType[]>(`/graph/newLink`, data);

export const deleteLink = () => POST<DatasetListItemType[]>(`/graph/deleteLink`);
