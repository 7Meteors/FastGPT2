// @ts-nocheck
import React, { useRef, useState } from 'react';
import { Box, Flex, Image, Button, useDisclosure, Grid, GridItem } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import type { ProColumns } from '@ant-design/pro-components';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import Avatar from '@fastgpt/web/components/common/Avatar';
import { UserStatusEnum, userStatusMap } from '@fastgpt/global/support/user/constant';
import { userList, userDelete, userUpdate } from '@/web/support/user/api';
import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import { hashStr } from '@fastgpt/global/common/string/tools';

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

const UsersMng: React.FC = () => {
  const { t } = useTranslation();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>();
  const [indexCount, setIndexCount] = useState<number>(0);
  const actionRef = useRef();

  const { ConfirmModal, openConfirm } = useConfirm({
    type: 'confirm'
  });
  const { openConfirm: openConfirmDel, ConfirmModal: ConfirmDelModal } = useConfirm({
    content: t('user:account.deleteTip'),
    type: 'delete'
  });
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
                  openConfirm(
                    async () => {
                      await userUpdate({
                        _id: record._id,
                        password: hashStr('123456')
                      });
                      actionRef.current.reload();
                    },
                    _,
                    t('user:account.resetPswTip')
                  )();
                }}
              >
                重置密码
              </a>,
              <a
                key="activate"
                onClick={() => {
                  openConfirm(
                    async () => {
                      await userUpdate({
                        _id: record._id,
                        status:
                          record.status === UserStatusEnum.active
                            ? UserStatusEnum.forbidden
                            : UserStatusEnum.active
                      });
                      actionRef.current.reload();
                    },
                    _,
                    record.status === UserStatusEnum.active
                      ? t('user:account.deactivateTip')
                      : t('user:account.activateTip')
                  )();
                }}
              >
                {record.status === UserStatusEnum.active ? '禁用' : '激活'}
              </a>,
              <a
                key="delete"
                style={{ color: 'red' }}
                onClick={() => {
                  openConfirmDel(async () => {
                    await userDelete({ _id: record._id });
                    actionRef.current.reload();
                  })();
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
          rowKey="_id"
          actionRef={actionRef}
          headerTitle=""
          toolBarRender={false}
          pagination={{
            pageSize: 10
          }}
          columns={columns}
          request={async ({ username, status }) => {
            const { users } = await userList({ username, status });
            return {
              data: users,
              success: true,
              total: users.length
            };
          }}
          value={dataSource}
        />
        <ConfirmModal />
        <ConfirmDelModal />
      </Box>
    </Flex>
  );
};

export default UsersMng;
