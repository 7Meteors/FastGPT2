// @ts-nocheck
import React, { useCallback } from 'react';
import { Box, Flex, useTheme } from '@chakra-ui/react';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useUserStore } from '@/web/support/user/useUserStore';
import PageContainer from '@/components/PageContainer';
import SideTabs from '@/components/SideTabs';
import LightRowTabs from '@fastgpt/web/components/common/Tabs/LightRowTabs';
import { serviceSideProps } from '@/web/common/utils/i18n';
import { useTranslation } from 'next-i18next';
import { useSystem } from '@fastgpt/web/hooks/useSystem';

const Dashboard = dynamic(() => import('./home'));
const Dataset = dynamic(() => import('./dataset'));

enum TabEnum {
  'dashboard' = 'dashboard',
  'dataset' = 'dataset'
}

const Account = ({ currentTab }: { currentTab: TabEnum }) => {
  const { t } = useTranslation();
  const { userInfo, setUserInfo } = useUserStore();
  const { feConfigs } = useSystemStore();
  const { isPc } = useSystem();

  const tabList = [
    {
      icon: 'support/user/individuation',
      label: t('graph:tabs.Dashboard'),
      value: TabEnum.dashboard
    },
    {
      icon: 'core/dataset/datasetLight',
      label: t('graph:tabs.Dataset'),
      value: TabEnum.dataset
    }
  ];

  const router = useRouter();
  const theme = useTheme();

  const setCurrentTab = useCallback(
    (tab: string) => {
      router.replace({
        query: {
          currentTab: tab
        }
      });
    },
    [router]
  );

  return (
    <>
      <PageContainer>
        <Flex flexDirection={['column', 'row']} h={'100%'} pt={[4, 0]}>
          {isPc ? (
            <Flex
              flexDirection={'column'}
              p={4}
              h={'100%'}
              flex={'0 0 200px'}
              borderRight={theme.borders.base}
            >
              <SideTabs<TabEnum>
                flex={1}
                mx={'auto'}
                mt={2}
                w={'100%'}
                list={tabList}
                value={currentTab}
                onChange={setCurrentTab}
              />
            </Flex>
          ) : (
            <Box mb={3}>
              <LightRowTabs<TabEnum>
                m={'auto'}
                size={isPc ? 'md' : 'sm'}
                list={tabList.map((item) => ({
                  value: item.value,
                  label: item.label
                }))}
                value={currentTab}
                onChange={setCurrentTab}
              />
            </Box>
          )}

          <Box flex={'1 0 0'} h={'100%'} pb={[4, 0]} overflow={'auto'}>
            {currentTab === TabEnum.dashboard && <Dashboard />}
            {currentTab === TabEnum.dataset && <Dataset />}
          </Box>
        </Flex>
      </PageContainer>
    </>
  );
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      currentTab: content?.query?.currentTab || TabEnum.dashboard,
      ...(await serviceSideProps(content, ['publish', 'user', 'graph']))
    }
  };
}

export default Account;
