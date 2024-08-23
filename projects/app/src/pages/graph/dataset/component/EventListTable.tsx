import React, { Ref, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { getEvents, deleteEvent, getCategoriesMap } from '@/web/core/graph/api';
import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import dayjs from 'dayjs';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Badge, Button } from 'antd';
import EventModal from './EventModal';

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

export const UrgencyMap: { [x: string]: { text: string; color: string } } = {
  jy: {
    text: '紧急',
    color: 'red'
  },
  yz: {
    text: '严重',
    color: 'orange'
  },
  yb: {
    text: '一般',
    color: 'blue'
  },
  qd: {
    text: '轻度',
    color: 'lime'
  }
};

const EventListTable: React.FC<{
  myRef: any;
}> = ({ myRef }) => {
  const { t } = useTranslation();

  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [editEventData, setEditEventData] = useState<any>();
  const [categoryData, setCategoryData] = useState<any>();

  const { openConfirm, ConfirmModal } = useConfirm({
    content: t('graph:dataset.confirm delete'),
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
        title: t('graph:dataset.event id'),
        dataIndex: 'id',
        hideInSearch: true
      },
      {
        title: t('graph:dataset.event issue'),
        dataIndex: 'issue'
      },
      {
        title: t('graph:dataset.event address'),
        dataIndex: 'address'
      },
      {
        title: t('graph:dataset.event urgency'),
        dataIndex: 'urgency_sym',
        valueEnum: UrgencyMap,
        render: (_, record: any) => (
          <Badge
            key={record.urgency_sym}
            color={UrgencyMap[record.urgency_sym].color}
            text={UrgencyMap[record.urgency_sym].text}
          />
        )
      },
      {
        title: t('graph:dataset.event smallcategory'),
        dataIndex: 'category_small_sym',
        hideInSearch: true,
        render: (_, record: any) => {
          if (categoryData?.smallCategories) {
            return categoryData?.smallCategories?.[record?.category_small_sym]?.name;
          } else {
            return '-';
          }
        }
      },
      {
        title: t('graph:dataset.event bigcategory'),
        dataIndex: 'bigcategory',
        hideInSearch: true,
        render: (_, record: any) => {
          if (categoryData?.smallCategories && categoryData?.bigCategories) {
            const smallCategory = categoryData?.smallCategories?.[record?.category_small_sym];
            return categoryData?.bigCategories?.[smallCategory?.category_big_sym]?.name || '-';
          } else {
            return '-';
          }
        }
      },
      {
        title: t('graph:dataset.created_at'),
        dataIndex: 'created_at',
        hideInSearch: true,
        render: (_: ReactNode, record: DataSourceType) =>
          dayjs(record.created_at).format('YYYY-MM-DD')
      },
      {
        title: t('graph:dataset.option'),
        valueType: 'option',
        width: 100,
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
    [categoryData, editTableEvent, openConfirm, t]
  );

  return (
    <>
      <ProTable
        rowKey="id"
        headerTitle=""
        actionRef={myRef}
        className="myListTable"
        search={{ labelWidth: 'auto', className: 'lightSearch', span: 4 }}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => editTableEvent(null)}>
            {t('graph:dataset.new event')}
          </Button>
        ]}
        options={false}
        request={async ({ current, pageSize, ...params }: any) => {
          const { data } = await getEvents();
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
      <EventModal
        open={isEventModalVisible}
        editData={editEventData}
        onClose={() => {
          setIsEventModalVisible(false);
        }}
        categoryData={categoryData}
        urgencyMap={UrgencyMap}
        onFinish={() => {
          setIsEventModalVisible(false);
          myRef?.current?.reload();
        }}
      />
      <ConfirmModal />
    </>
  );
};

export default EventListTable;
