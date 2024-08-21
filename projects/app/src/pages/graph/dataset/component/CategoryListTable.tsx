// @ts-nocheck
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { deleteNode, editNode, getLinks, newNode } from '@/web/core/graph/api';
import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import { NodeTypeMap } from '../index';

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

const LinkListTable: React.FC = ({ myRef }) => {
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
      title: `起始节点类型`,
      dataIndex: 'sourceType',
      render: (_, record) => {
        return NodeTypeMap[record.r.type]?.label;
      }
    },
    {
      title: `起始节点名称`,
      dataIndex: 'sourceName',
      render: (_, record) => {
        return record.a?.properties?.name;
      }
    },
    {
      title: `目标节点类型`,
      dataIndex: 'targetType',
      render: (_, record) => {
        return NodeTypeMap[record.r.type]?.label;
      }
    },
    {
      title: `目标节点名称`,
      dataIndex: 'targetName',
      render: (_, record) => {
        return record.b?.properties?.name;
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
      <ProTable
        rowKey="id"
        actionRef={myRef}
        headerTitle=""
        recordCreatorProps={{
          position: 'top',
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) })
        }}
        // search={{ labelWidth: 'auto', span: 4, className: 'lightSearch' }}
        search={false}
        className="nodeListTable"
        loading={false}
        columns={columns}
        toolBarRender={false}
        request={async (params: any) => {
          const { data } = await getLinks(params);
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
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          onSave: async (_: any, record: any, originObj: any, newLineConfig: any) => {
            console.log('newLineConfig', newLineConfig);
            try {
              if (newLineConfig) {
                await newNode({
                  name: record.name,
                  type: record.type
                });
              } else {
                if (record.name === originObj.name && record.type === originObj.type) {
                  return;
                }
                await editNode({
                  name: record.name as string,
                  type: record.type,
                  ...(originObj.type === record.type ? {} : { oldType: originObj.type }),
                  id: record.id
                });
              }
              toast({
                status: 'success',
                title: `${newLineConfig ? '新建' : '编辑'}节点成功`
              });
            } catch (error: Error) {
              toast({
                status: 'error',
                title: error.message
              });
            } finally {
              const { data } = await getLinks();
              setDataSource(data as any);
            }
          }
        }}
      />
      <ConfirmModal />
    </>
    // @ts-ignore
  );
};

export default LinkListTable;
