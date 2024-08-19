// @ts-nocheck
import React, { RefObject, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { deleteNode, editNode, getNodes, newNode } from '@/web/core/graph/api';
import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import { NodeTypeMap } from '..';

const ProTable = dynamic(
  (): any => import('@ant-design/pro-components').then((item) => item.ProTable),
  {
    ssr: false
  }
);

type DataSourceType = {
  id: string;
  name: string;
  type: string;
};

const NodeListTable: React.FC<{
  myRef: any;
  editTableNode: (data: DataSourceType) => void;
}> = ({ myRef, editTableNode }) => {
  const { toast } = useToast();

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
      title: `ID`,
      dataIndex: 'id',
      tooltip: '唯一标识',
      readonly: true,
      width: '15%',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: `名称`,
      dataIndex: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: {
        [NodeTypeMap.bigcategory.value]: {
          text: NodeTypeMap.bigcategory.label
        },
        [NodeTypeMap.smallcategory.value]: {
          text: NodeTypeMap.smallcategory.label
        },
        [NodeTypeMap.event.value]: {
          text: NodeTypeMap.event.label
        }
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }]
        };
      }
    },
    {
      title: `内容/地址`,
      dataIndex: 'content',
      hideInSearch: true,
      renderFormItem: (_, { content, address }: any) => content || address
    },
    {
      title: `创建时间`,
      dataIndex: 'createTime',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            editTableNode(record);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            openConfirm(async () => {
              await deleteNode({ name: record.name, type: record.type });
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
        recordCreatorProps={{
          position: 'top',
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) })
        }}
        className="nodeListTable"
        search={{ labelWidth: 'auto', span: 4, className: 'lightSearch' }}
        loading={false}
        columns={columns}
        toolBarRender={false}
        request={async (params: any) => {
          const { data } = await getNodes(params);
          return {
            data: data,
            total: data.length,
            success: true
          };
        }}
        pagination={{
          pageSize: 10
        }}
        value={dataSource}
      />
      <ConfirmModal />
    </>
    // @ts-ignore
  );
};

export default NodeListTable;
