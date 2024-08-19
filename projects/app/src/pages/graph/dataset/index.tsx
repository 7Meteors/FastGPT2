// @ts-nocheck

import React, { useCallback, useRef, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serviceSideProps } from '@/web/common/utils/i18n';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import LightRowTabs from '@fastgpt/web/components/common/Tabs/LightRowTabs';
import { newNode } from '@/web/core/graph/api';
import { Button } from 'antd';

const NodeListTable = dynamic(() => import('./component/NodeListTable'));
const LinkListTable = dynamic(() => import('./component/LinkListTable'));
const NewNodeModal = dynamic(() => import('./component/NewNodeModal').then((item) => item), {
  ssr: false
});
const NewLinkModal = dynamic((): any => import('./component/NewLinkModal').then((item) => item), {
  ssr: false
});

// 备选颜色     紫色：rgb(127, 59, 245)   红色： rgb(245, 74, 69)   深蓝色：rgb(36, 91, 219)
export const NodeTypeMap: any = {
  bigcategory: {
    value: 'bigcategory',
    label: '大类',
    color: 'rgb(186, 206, 253)',
    props: {}
  },
  smallcategory: {
    value: 'smallcategory',
    label: '小类',
    color: 'rgb(254, 212, 164)',
    props: [{ key: 'content', type: 'string' }]
  },
  event: {
    value: 'event',
    label: '事件',
    color: 'rgb(52, 199, 36)',
    props: [
      { key: 'address', type: 'string' },
      { key: 'status', type: 'string' }
    ]
  }
};

export enum DatasetTypeEnum {
  node = 'node',
  link = 'link'
}

const Dataset = () => {
  const { t } = useTranslation();
  const nodeTableRef = useRef();
  const linkTableRef = useRef();
  const [appType, setAppType] = useState(DatasetTypeEnum.node);

  const [isNewNodeModalVisible, setIsNewNodeModalVisible] = useState(false);
  const [editNodeData, setEditNodeData] = useState<any>();

  const editTableNode = useCallback((nodeData: any) => {
    setEditNodeData(nodeData);
    setIsNewNodeModalVisible(true);
  }, []);

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
            <Button
              type="primary"
              onClick={() => {
                editTableNode(null);
              }}
            >
              新建节点
            </Button>
          )}
          {appType === DatasetTypeEnum.link && (
            <NewLinkModal
              onFinish={() => {
                linkTableRef.current?.reload();
              }}
            />
          )}
        </Flex>
        <NewNodeModal
          open={isNewNodeModalVisible}
          editNodeData={editNodeData}
          onClose={() => {
            setIsNewNodeModalVisible(false);
          }}
          onFinish={() => {
            setIsNewNodeModalVisible(false);
            nodeTableRef.current?.reload();
          }}
        />
        <Flex alignItems={'center'}>
          {appType === DatasetTypeEnum.node && (
            <div style={{ flex: 1, width: '100%' }}>
              <NodeListTable myRef={nodeTableRef} editTableNode={editTableNode} />
            </div>
          )}
          {appType === DatasetTypeEnum.link && (
            <div style={{ flex: 1, width: '100%' }}>
              <LinkListTable myRef={linkTableRef} />
            </div>
          )}
        </Flex>
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

export default Dataset;
