// @ts-nocheck
import React, { useState } from 'react';
import { Box, Flex, Image, Button, useDisclosure, Grid, GridItem } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import type { ProColumns } from '@ant-design/pro-components';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import Avatar from '@fastgpt/web/components/common/Avatar';
import { UserStatusEnum, userStatusMap } from '@fastgpt/global/support/user/constant';
import { userList } from '@/web/support/user/api';

const ProTable = dynamic(
  (): any => import('@ant-design/pro-components').then((item) => item.ProTable),
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
      dataIndex: 'username'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      render(_, record) {
        return <Avatar src={record?.avatar} borderRadius={'50%'} w="32px" h="32px" />;
      }
    },
    {
      title: '时区',
      dataIndex: 'timezone',
      hideInSearch: true,
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }]
        };
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      render(_, record) {
        return record.createTime ? dayjs(record.createTime).format('YYYY/MM/DD HH:mm:ss') : '-';
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
      width: 165,
      render: (text, record, _, action) =>
        record.username === 'root'
          ? []
          : [
              <a
                key="resetPsw"
                onClick={() => {
                  action?.startEditable?.(record.id);
                }}
              >
                重置密码
              </a>,
              <a
                key="activate"
                onClick={() => {
                  action?.startEditable?.(record.id);
                }}
              >
                {record.state === UserStatusEnum.active ? '禁用' : '激活'}
              </a>,
              <a
                key="delete"
                style={{ color: 'red' }}
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
        <ProTable<DataSourceType>
          rowKey="id"
          headerTitle=""
          toolBarRender={false}
          columns={columns}
          request={async () => {
            const { users } = await userList();
            return {
              data: users,
              success: true,
              total: users.length
            };
          }}
          value={dataSource}
        />
      </Box>
    </Flex>
    // @ts-ignore
  );
};

export default UsersMng;
