// @ts-nocheck
import React, { useState } from 'react';
import { Box, Flex, Image, Button, useDisclosure, Grid, GridItem } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import type { ProColumns } from '@ant-design/pro-components';
import dynamic from 'next/dynamic';
import { UserStatusEnum, userStatusMap } from '@fastgpt/global/support/user/constant';

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

const UsersMng: React.FC<{ title: string; initData: any[]; newColumns?: any[] }> = ({
  title,
  initData,
  newColumns
}) => {
  const { t } = useTranslation();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>();
  const [indexCount, setIndexCount] = useState<number>(0);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '用户名称',
      dataIndex: 'username',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }]
        };
      }
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        [UserStatusEnum.forbidden]: {
          text: '失效',
          status: 'Error'
        },
        [UserStatusEnum.active]: {
          text: '生效',
          status: 'Success'
        }
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
    <Flex p={4} className="users-mng">
      <Box flexGrow={1}>
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
          request={async () => ({
            data: initData,
            total: 3,
            success: true
          })}
          value={dataSource}
          onChange={setDataSource}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row);
              setIndexCount(indexCount + 1);
              await waitTime(500);
            },
            onChange: setEditableRowKeys
          }}
        />
      </Box>
    </Flex>
    // @ts-ignore
  );
};

export default UsersMng;
