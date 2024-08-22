import React, { useRef, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serviceSideProps } from '@/web/common/utils/i18n';
import LightRowTabs from '@fastgpt/web/components/common/Tabs/LightRowTabs';
import EventListTable from './component/EventListTable';
import CategoryListTable from './component/CategoryListTable';

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
  bigcategory = 'bigcategory',
  smallcategory = 'smallcategory'
}

const Dataset = () => {
  const { t } = useTranslation();

  const eventTableRef = useRef();
  const smallcategoryTableRef = useRef();
  const bigcategoryTableRef = useRef();

  const [appType, setAppType] = useState(DatasetTypeEnum.event);

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
                label: t('graph:dataset.smallcategory'),
                value: DatasetTypeEnum.smallcategory
              },
              {
                label: t('graph:dataset.bigcategory'),
                value: DatasetTypeEnum.bigcategory
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
        </Flex>
        <Flex alignItems={'center'}>
          {appType === DatasetTypeEnum.event && (
            <div style={{ flex: 1, width: '100%' }}>
              <EventListTable myRef={eventTableRef} />
            </div>
          )}
          {appType === DatasetTypeEnum.smallcategory && (
            <div style={{ flex: 1, width: '100%' }}>
              <CategoryListTable
                myRef={smallcategoryTableRef}
                appType={DatasetTypeEnum.smallcategory}
              />
            </div>
          )}
          {appType === DatasetTypeEnum.bigcategory && (
            <div style={{ flex: 1, width: '100%' }}>
              <CategoryListTable
                myRef={bigcategoryTableRef}
                appType={DatasetTypeEnum.bigcategory}
              />
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
