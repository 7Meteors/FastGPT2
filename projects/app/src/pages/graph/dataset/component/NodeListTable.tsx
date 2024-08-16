import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import type { ProColumns } from '@ant-design/pro-components';
import dynamic from 'next/dynamic';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { deleteNode, getNodes, newNode } from '@/web/core/graph/api';
import { useConfirm } from '@fastgpt/web/hooks/useConfirm';

const EditableProTable = dynamic(
  (): any => import('@ant-design/pro-components').then((item) => item.EditableProTable),
  {
    ssr: false
  }
);

type DataSourceType = {
  id: string;
  name: string;
  type: string;
};

export const NodeTypes = {
  bigcategory: { value: 'bigcategory', label: '事件大类', color: 'red' },
  smallcategory: { value: 'smallcategory', label: '事件小类', color: 'yellow' }
};

const NodeListTable: React.FC = () => {
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
      dataIndex: 'name',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }]
        };
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: {
        [NodeTypes.bigcategory.value]: {
          text: NodeTypes.bigcategory.label,
          status: 'Error'
        },
        [NodeTypes.smallcategory.value]: {
          text: NodeTypes.smallcategory.label,
          status: 'Success'
        }
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }]
        };
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
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
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle=""
        recordCreatorProps={{
          position: 'bottom',
          record: () => {
            return { id: indexCount };
          }
        }}
        className="nodeListTable"
        search={true}
        loading={false}
        columns={columns}
        request={async () => {
          const res = await getNodes();
          return {
            data: res,
            total: res.length,
            success: true
          };
        }}
        value={dataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (_, { name, type }: any) => {
            await newNode({ name, type });
            const res = await getNodes();
            setDataSource(res as any);
            toast({
              status: 'success',
              title: '新建节点成功'
            });
          },
          onChange: setEditableRowKeys
        }}
      />
      <ConfirmModal />
    </>
    // @ts-ignore
  );
};

export default NodeListTable;
