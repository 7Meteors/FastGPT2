import React from 'react';
import { Box, Flex, Image, Grid, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serviceSideProps } from '@/web/common/utils/i18n';
import ParentPaths from '@/components/common/folder/Path';
import { DatasetsContext } from './context';
import DatasetContextProvider from './context';
import { useContextSelector } from 'use-context-selector';
import { useSystem } from '@fastgpt/web/hooks/useSystem';
import RelationGraph from './component/RelationGraph';
import BlockWrapper from './component/BlockWrapper';
import StatisticalGraphA from './component/StatisticalGraphA';
import StatisticalGraphB from './component/StatisticalGraphB';
import StatisticalGraphC from './component/StatisticalGraphC';
import StatisticalGraphD from './component/StatisticalGraphD';

const Dataset = () => {
  useSystem();
  const { t } = useTranslation();
  const router = useRouter();

  const { paths } = useContextSelector(DatasetsContext, (v) => v);

  return (
    <Flex p={4}>
      <Flex flexGrow={1} flexDirection="column">
        <Flex alignItems={'flex-start'} justifyContent={'space-between'}>
          <ParentPaths
            paths={paths}
            FirstPathDom={
              <Flex flex={1} alignItems={'center'}>
                <Image src={'/imgs/workflow/db.png'} alt={''} mr={2} h={'24px'} />
                <Box className="textlg" letterSpacing={1} fontSize={'24px'} fontWeight={'bold'}>
                  {t('common:core.dataset.My Graph')}
                </Box>
              </Flex>
            }
            onClick={(e) => {
              router.push({
                query: {
                  parentId: e
                }
              });
            }}
          />
        </Flex>
        <Box flexGrow={1}>
          <Grid
            flexGrow={1}
            py={5}
            gridTemplateColumns={['1fr', 'repeat(2,1fr)', 'repeat(3,1fr)']}
            gridGap={5}
            userSelect={'none'}
          >
            <BlockWrapper>
              <StatisticalGraphA />
            </BlockWrapper>
            {/* <BlockWrapper>
              <StatisticalGraphB />
            </BlockWrapper> */}
            <BlockWrapper>
              <StatisticalGraphC />
            </BlockWrapper>
            <BlockWrapper>
              <StatisticalGraphD />
            </BlockWrapper>
            <GridItem colSpan={3}>
              <BlockWrapper>
                <RelationGraph />
              </BlockWrapper>
            </GridItem>
          </Grid>
        </Box>
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
