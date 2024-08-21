// @ts-nocheck
import React, { Ref, RefObject, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { deleteNode, editNode, getNodes, newNode, getEvents } from '@/web/core/graph/api';
import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import { NodeTypeMap } from '..';
import dayjs from 'dayjs';
import { ProTable } from '@ant-design/pro-components';

type DataSourceType = {
  id: string;
  name: string;
  type: string;
};

const UrgencyMap = {
  yz: {
    text: '严重'
  },
  jy: {
    text: '紧急'
  },
  yb: {
    text: '紧急'
  },
  qd: {
    text: '轻度'
  }
};

const EventListTable: React.FC<{
  myRef: Ref;
  editTableRow: (data: DataSourceType) => void;
}> = ({ myRef, editTableRow }) => {
  const { t } = useTranslation();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>();
  const [indexCount, setIndexCount] = useState<number>(0);

  const { openConfirm, ConfirmModal } = useConfirm({
    content: '是否确认删除',
    type: 'delete'
  });

  const columns: ProColumns<DataSourceType>[] = [
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
      dataIndex: 'address',
      hideInSearch: true
    },
    {
      title: t('graph:dataset.event urgency'),
      dataIndex: 'urgency_sym',
      hideInSearch: true,
      valueEnum: UrgencyMap
    },
    {
      title: t('graph:dataset.event smallcategory'),
      dataIndex: 'smallcategory',
      hideInSearch: true
    },
    {
      title: t('graph:dataset.event bigcategory'),
      dataIndex: 'bigcategory',
      hideInSearch: true
    },
    {
      title: `创建时间`,
      dataIndex: 'created_at',
      hideInSearch: true,
      render: (str) => dayjs(str).format('YYYY-MM-DD')
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            editTableRow(record);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            openConfirm(async () => {
              await deleteEvent({ id: record.id });
              action?.reloadAndRest?.();
            })();
          }}
        >
          删除
        </a>
      ]
    }
  ];

  return (
    <>
      <ProTable
        rowKey="id"
        headerTitle=""
        actionRef={myRef}
        className="myListTable"
        search={{ labelWidth: 'auto', span: 4, className: 'lightSearch' }}
        columns={columns}
        toolBarRender={false}
        request={async (params: any) => {
          const { data } = await getEvents();
          const result = data.filter((item) => !!item);
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
      <ConfirmModal />
    </>
  );
};

export default EventListTable;
