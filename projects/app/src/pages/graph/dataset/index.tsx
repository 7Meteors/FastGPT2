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
import EventListTable from './component/EventListTable';
import CategoryListTable from './component/CategoryListTable';
import EventModal from './component/EventModal';
import CategoryModal from './component/CategoryModal';

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
  event = 'event',
  category = 'category'
}

const Dataset = () => {
  const { t } = useTranslation();
  const eventTableRef = useRef();
  const categoryTableRef = useRef();
  const [appType, setAppType] = useState(DatasetTypeEnum.event);

  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [editEventData, setEditEventData] = useState<any>();
  const [editCategoryData, setEditCategoryData] = useState<any>();

  const editTableEvent = useCallback((eventData: any) => {
    setEditNodeData(nodeData);
    setIsEventModalVisible(true);
  }, []);

  const editTableCategory = useCallback((categoryData: any) => {
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
                label: t('graph:dataset.event'),
                value: DatasetTypeEnum.event
              },
              {
                label: t('graph:dataset.category'),
                value: DatasetTypeEnum.category
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
          {appType === DatasetTypeEnum.event && (
            <Button
              type="primary"
              onClick={() => {
                editEventData(null);
              }}
            >
              {t('graph:dataset.new event')}
            </Button>
          )}
          {appType === DatasetTypeEnum.category && (
            <Button
              type="primary"
              onClick={() => {
                editCategoryData(null);
              }}
            >
              {t('graph:dataset.new category')}
            </Button>
          )}
        </Flex>
        <EventModal
          open={isEventModalVisible}
          editData={editEventData}
          onClose={() => {
            setIsEventModalVisible(false);
          }}
          onFinish={() => {
            setIsEventModalVisible(false);
            eventTableRef.current?.reload();
          }}
        />
        <CategoryModal
          open={isCategoryModalVisible}
          editData={editCategoryData}
          onClose={() => {
            setIsCategoryModalVisible(false);
          }}
          onFinish={() => {
            setIsCategoryModalVisible(false);
            categoryTableRef.current?.reload();
          }}
        />
        <Flex alignItems={'center'}>
          {appType === DatasetTypeEnum.event && (
            <div style={{ flex: 1, width: '100%' }}>
              <EventListTable myRef={eventTableRef} editTableRow={editTableEvent} />
            </div>
          )}
          {/* {appType === DatasetTypeEnum.category && (
            <div style={{ flex: 1, width: '100%' }}>
              <CategoryListTable myRef={categoryTableRef} editTableRow={editTableCategory} />
            </div>
          )} */}
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
