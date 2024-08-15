import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Table, Thead, Tr, Th, Tbody, Td, Flex, Box, Switch, MenuButton } from '@chakra-ui/react';
import { formatTime2YMDHM } from '@fastgpt/global/common/string/time';
import {
  checkCollectionIsFolder,
  getTrainingTypeLabel
} from '@fastgpt/global/core/dataset/collection/utils';
import { DatasetCollectionTypeEnum } from '@fastgpt/global/core/dataset/constants';
import MyMenu from '@fastgpt/web/components/common/MyMenu';
import MyTooltip from '@fastgpt/web/components/common/MyTooltip';
import router from 'next/router';
import { TabEnum } from '../../detail';
import { useContextSelector } from 'use-context-selector';

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

const NodeTable: React.FC<{ ref: any }> = ({ ref }) => {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>();
  const [displayData, setDisplayData] = useState<readonly DataSourceType[]>();

  const [nameSearch, setNameSearch] = useState<readonly DataSourceType[]>();

  const columns = [
    {
      title: `ID`,
      dataIndex: 'id',
      readonly: true,
      py: 4
    },
    {
      title: `名称`,
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
    <>
      <Table variant={'simple'} draggable={false}>
        <Thead draggable={false}>
          <Tr>
            {columns.map((col) => (
              <Th key={col.dataIndex} py={col.py}>
                {col.title}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr h={'5px'} />
        </Tbody>
      </Table>
      <Flex mt={2} justifyContent={'center'}>
        {/* <Pagination /> */}
      </Flex>
    </>
  );
};

export default NodeTable;
