import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import {
  deleteEvent,
  getCategoriesMap,
  bigcategoryList,
  smallcategoryList
} from '@/web/core/graph/api';
import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { DatasetTypeEnum } from '..';
import CategoryModal from './CategoryModal';

type DataSourceType = {
  id: number;
  address: string;
  issue: string;
  category_big_sym?: number;
  category_small_sym?: number;
  created_at: string;
  urgency_sym: string;
  status?: string;
};

const CategoryListTable: React.FC<{
  myRef: any;
  appType: DatasetTypeEnum;
}> = ({ myRef, appType }) => {
  const { t } = useTranslation();

  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [editEventData, setEditEventData] = useState<any>();
  const [categoryData, setCategoryData] = useState<any>();

  const { openConfirm, ConfirmModal } = useConfirm({
    content: '是否确认删除',
    type: 'delete'
  });

  useEffect(() => {
    async function fetchData() {
      const { data } = await getCategoriesMap();
      setCategoryData(data);
    }
    fetchData();
  }, []);

  const editTableEvent = useCallback((eventData: any) => {
    setEditEventData(eventData);
    setIsEventModalVisible(true);
  }, []);

  const columns: ProColumns<DataSourceType>[] = useMemo(
    () => [
      {
        title: t('graph:dataset.category id'),
        dataIndex: 'id'
      },
      {
        title: t('graph:dataset.category name'),
        dataIndex: 'name'
      },
      ...(appType === DatasetTypeEnum.smallcategory
        ? [
            {
              title: t('graph:dataset.category content'),
              dataIndex: 'content',
              hideInSearch: true
            },
            {
              title: t('graph:dataset.unit'),
              dataIndex: 'unit',
              hideInSearch: true
            },
            {
              title: t('graph:dataset.department'),
              dataIndex: 'department',
              hideInSearch: true
            },
            {
              title: t('graph:dataset.category belongTo'),
              dataIndex: 'category_big_sym',
              hideInSearch: true,
              render: (_: any, record: any) => {
                if (categoryData?.smallCategories) {
                  return categoryData?.smallCategories?.[record?.category_small_sym]?.name;
                } else {
                  return '-';
                }
              }
            }
          ]
        : []),
      {
        title: t('graph:dataset.option'),
        valueType: 'option',
        width: 200,
        render: (_: any, record: any, ___: any, action: any) => [
          <a
            key="editable"
            onClick={() => {
              editTableEvent(record);
            }}
          >
            {t('graph:dataset.edit')}
          </a>,
          <a
            key="delete"
            style={{ color: 'red' }}
            onClick={async () => {
              openConfirm(async () => {
                await deleteEvent({ id: record.id });
                action?.reloadAndRest?.();
              })();
            }}
          >
            {t('graph:dataset.delete')}
          </a>
        ]
      }
    ],
    [appType, categoryData?.smallCategories, editTableEvent, openConfirm, t]
  );

  return (
    <>
      <ProTable
        rowKey="id"
        headerTitle=""
        actionRef={myRef}
        className="myListTable"
        search={{ labelWidth: 'auto', span: 4, className: 'lightSearch' }}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => editTableEvent(null)}>
            {t(
              appType === DatasetTypeEnum.smallcategory
                ? 'graph:dataset.new smallcategory'
                : 'graph:dataset.new bigcategory'
            )}
          </Button>
        ]}
        options={false}
        request={async ({ current, pageSize, ...params }: any) => {
          const { data } = await (appType === DatasetTypeEnum.smallcategory
            ? smallcategoryList()
            : bigcategoryList());
          const result = data.filter((item) => {
            for (const key in params) {
              if (item[key].indexOf(params[key]) < 0) {
                return false;
              }
            }
            return true;
          });
          return {
            data: result,
            total: result.length,
            success: true
          };
        }}
        pagination={{
          pageSize: 10
        }}
      />
      <CategoryModal
        open={isEventModalVisible}
        editData={editEventData}
        onClose={() => {
          setIsEventModalVisible(false);
        }}
        isSmallcategory={appType === DatasetTypeEnum.smallcategory}
        categoryData={categoryData}
        onFinish={() => {
          setIsEventModalVisible(false);
          myRef.current?.reload();
        }}
      />
      <ConfirmModal />
    </>
  );
};

export default CategoryListTable;
