import React, { useRef, useState } from 'react';
import { Flex, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Box } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serviceSideProps } from '@/web/common/utils/i18n';
import DatasetContextProvider from './context';
import dynamic from 'next/dynamic';
import GraphTable from './component/NodeListTable';
import { useRouter } from 'next/router';
import LightRowTabs from '@fastgpt/web/components/common/Tabs/LightRowTabs';

const NodeListTable = dynamic(() => import('./component/NodeListTable'));
const NodeTable = dynamic(() => import('./component/NodeTable'));
const LinkTable = dynamic(() => import('./component/NodeTable'));

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

export enum DatasetTypeEnum {
  node = 'node',
  link = 'link'
}

export enum NodeTypeEnum {
  eventClass = 'eventClass',
  subEventClass = 'subEventClass',
  unit = 'unit',
  department = 'department'
}

const Dataset = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const nodeTableRef = useRef(null);
  const linkTableRef = useRef(null);
  const [appType, setAppType] = useState(DatasetTypeEnum.node);

  return (
    <Flex p={4} className="graph-table">
      <Flex flexGrow={1} flexDirection="column" style={{ width: '100%' }}>
        <Flex flexGrow={1} style={{ width: '100%' }} justifyContent="space-between">
          <LightRowTabs
            list={[
              {
                label: t('graph:dataset.node'),
                value: DatasetTypeEnum.node
              },
              {
                label: t('graph:dataset.link'),
                value: DatasetTypeEnum.link
              }
            ]}
            inlineStyles={{ px: 0.5 }}
            gap={5}
            display={'flex'}
            alignItems={'center'}
            fontSize={['sm', 'md']}
            flexShrink={0}
            value={appType}
            onChange={setAppType}
          />
          {appType === DatasetTypeEnum.node && (
            <Button variant={'whitePrimary'} size="sm" borderRadius={'md'} ml={3}>
              {t('common:user.team.Invite Member')}
            </Button>
          )}
        </Flex>

        <Flex alignItems={'center'}>
          {appType === DatasetTypeEnum.node && (
            <div style={{ flex: 1, width: '100%' }}>
              <NodeListTable />
            </div>
          )}
          {appType === DatasetTypeEnum.link && <LinkTable ref={linkTableRef} />}
        </Flex>
        {/* <Tabs>
          <TabList>
            <Tab>{t('graph:dataset.Event class')}</Tab>
            <Tab>{t('graph:dataset.Event subclass')}</Tab>
            <Tab>{t('graph:dataset.Event connection')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <GraphTable
                title="数据大类"
                initData={[
                  {
                    id: 0,
                    name: '交通管理',
                    desc: '交通管理相关'
                  },
                  {
                    id: 1,
                    name: '环境保护',
                    desc: '环境保护相关'
                  },
                  {
                    id: 2,
                    name: '城市规划',
                    desc: '城市规划相关'
                  },
                  {
                    id: 3,
                    name: '公共服务',
                    desc: '公共服务相关'
                  },
                  {
                    id: 4,
                    name: '消费者权益',
                    desc: '消费者权益相关'
                  }
                ]}
              />
            </TabPanel>
            <TabPanel>
              <GraphTable
                title="数据小类"
                initData={[
                  {
                    id: 0,
                    name: '假冒伪劣产品',
                    desc: '假冒伪劣产品相关，包括XXX等等'
                  },
                  {
                    id: 1,
                    name: '售后服务不佳',
                    desc: '售后服务不佳相关，包括XXX等等'
                  },
                  {
                    id: 2,
                    name: '食品安全问题',
                    desc: '食品安全问题相关，包括XXX等等'
                  },
                  {
                    id: 3,
                    name: '价格欺诈',
                    desc: '价格欺诈相关，包括XXX等等'
                  },
                  {
                    id: 4,
                    name: '商品虚假宣传',
                    desc: '商品虚假宣传相关，包括XXX等等'
                  },
                  {
                    id: 5,
                    name: '工业废水排放',
                    desc: '工业废水排放相关，包括XXX等等'
                  },
                  {
                    id: 6,
                    name: '空气污染',
                    desc: '空气污染相关，包括XXX等等'
                  },
                  {
                    id: 7,
                    name: '噪音扰民',
                    desc: '噪音扰民相关，包括XXX等等'
                  },
                  {
                    id: 8,
                    name: '非法砍伐森林',
                    desc: '非法砍伐森林相关，包括XXX等等'
                  },
                  {
                    id: 9,
                    name: '土壤污染',
                    desc: '土壤污染相关，包括XXX等等'
                  },
                  {
                    id: 10,
                    name: '野生动物保护',
                    desc: '野生动物保护相关，包括XXX等等'
                  }
                ]}
              />
            </TabPanel>
            <TabPanel>
              <GraphTable
                title="数据关联"
                newColumns={[
                  {
                    title: `数据关联ID`,
                    dataIndex: 'id',
                    tooltip: '唯一标识',
                    readonly: true,
                    width: '15%'
                  },
                  {
                    title: `数据大类名称`,
                    dataIndex: 'eventName',
                    formItemProps: () => {
                      return {
                        rules: [{ required: true, message: '此项为必填项' }]
                      };
                    }
                  },
                  {
                    title: '数据大类名称',
                    dataIndex: 'subEventName',
                    formItemProps: () => {
                      return {
                        rules: [{ required: true, message: '此项为必填项' }]
                      };
                    }
                  }
                ]}
                initData={[
                  {
                    id: 0,
                    eventName: '消费者权益',
                    subEventName: '假冒伪劣产品'
                  },
                  {
                    id: 1,
                    eventName: '消费者权益',
                    subEventName: '售后服务不佳'
                  },
                  {
                    id: 2,
                    eventName: '消费者权益',
                    subEventName: '食品安全问题'
                  },
                  {
                    id: 3,
                    eventName: '消费者权益',
                    subEventName: '价格欺诈'
                  },
                  {
                    id: 4,
                    eventName: '消费者权益',
                    subEventName: '商品虚假宣传'
                  },
                  {
                    id: 5,
                    eventName: '环境保护',
                    subEventName: '工业废水排放'
                  },
                  {
                    id: 6,
                    eventName: '环境保护',
                    subEventName: '空气污染'
                  },
                  {
                    id: 7,
                    eventName: '环境保护',
                    subEventName: '噪音扰民'
                  },
                  {
                    id: 8,
                    eventName: '环境保护',
                    subEventName: '非法砍伐森林'
                  },
                  {
                    id: 9,
                    eventName: '环境保护',
                    subEventName: '土壤污染'
                  },
                  {
                    id: 10,
                    eventName: '环境保护',
                    subEventName: '野生动物保护'
                  }
                ]}
              />
            </TabPanel>
          </TabPanels>
        </Tabs> */}
      </Flex>
    </Flex>
  );
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content, ['dataset']))
    }
  };
}

function DatasetContextWrapper() {
  return (
    <DatasetContextProvider>
      <Dataset />
    </DatasetContextProvider>
  );
}

export default DatasetContextWrapper;
