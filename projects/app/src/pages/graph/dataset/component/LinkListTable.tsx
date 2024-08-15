import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import type { ProColumns } from '@ant-design/pro-components';
import dynamic from 'next/dynamic';
import { getNodes } from '@/web/core/graph/api';

const EditableProTable = dynamic(
  (): any => import('@ant-design/pro-components').then((item) => item.EditableProTable),
  {
    ssr: false
  }
);

type DataSourceType = {
  id: React.Key;
  title?: string;
  readonly?: string;
  decs?: string;
  state?: string;
  created_at?: number;
  update_at?: number;
  children?: DataSourceType[];
};

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const GraphTable: React.FC<{ title: string; newColumns?: any[] }> = ({ title, newColumns }) => {
  const { t } = useTranslation();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>();
  const [indexCount, setIndexCount] = useState<number>(0);

  const columns: ProColumns<DataSourceType>[] = [
    ...(newColumns
      ? newColumns
      : [
          {
            title: `${title}ID`,
            dataIndex: 'id',
            tooltip: '唯一标识',
            readonly: true,
            width: '15%'
          },
          {
            title: `${title}名称`,
            dataIndex: 'name',
            formItemProps: (_form: any) => {
              return {
                rules: [{ required: true, message: '此项为必填项' }]
              };
            }
          },
          {
            title: '描述',
            dataIndex: 'desc'
          }
        ]),
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
          onClick={() => {
            setDataSource(dataSource!.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>
      ]
    }
  ];

  return (
    // @ts-ignore
    <EditableProTable<DataSourceType>
      rowKey="id"
      headerTitle=""
      recordCreatorProps={{
        position: 'bottom',
        record: () => {
          return { id: indexCount };
        }
      }}
      loading={false}
      columns={columns}
      request={async () => {
        const res = await getNodes();
        console.log('res:'), res;

        return {
          data: [],
          total: 0,
          success: true
        };
      }}
      value={dataSource}
      onChange={setDataSource}
      editable={{
        type: 'multiple',
        editableKeys,
        onSave: async (rowKey: any, data: any, row: any) => {
          console.log(rowKey, data, row);
          setIndexCount(indexCount + 1);
          await waitTime(500);
        },
        onChange: setEditableRowKeys
      }}
    />
  );
};

export default GraphTable;
