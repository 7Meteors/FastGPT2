import React, { useState } from 'react';
import { Box, Flex, Image, Button, useDisclosure, Grid, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import PageContainer from '@/components/PageContainer';
import { useTranslation } from 'next-i18next';
import { serviceSideProps } from '@/web/common/utils/i18n';
import ParentPaths from '@/components/common/folder/Path';
import List from './component/List';
import { DatasetsContext } from './context';
import DatasetContextProvider from './context';
import { useContextSelector } from 'use-context-selector';
import MyMenu from '@fastgpt/web/components/common/MyMenu';
import { AddIcon } from '@chakra-ui/icons';
import { useUserStore } from '@/web/support/user/useUserStore';
import MyIcon from '@fastgpt/web/components/common/Icon';
import { FolderIcon } from '@fastgpt/global/common/file/image/constants';
import { EditFolderFormType } from '@fastgpt/web/components/common/MyModal/EditFolderModal';
import dynamic from 'next/dynamic';
import { postCreateDatasetFolder, resumeInheritPer } from '@/web/core/dataset/api';
import FolderSlideCard from '@/components/common/folder/SlideCard';
import {
  DatasetDefaultPermissionVal,
  DatasetPermissionList
} from '@fastgpt/global/support/permission/dataset/constant';
import {
  postUpdateDatasetCollaborators,
  deleteDatasetCollaborators,
  getCollaboratorList
} from '@/web/core/dataset/api/collaborator';
import { useSystem } from '@fastgpt/web/hooks/useSystem';
import RelationGraph from './component/RelationGraph';
import BlockWrapper from './component/BlockWrapper';
import StatisticalGraph1 from './component/StatisticalGraph1';
import StatisticalGraphA from './component/StatisticalGraphA';
import StatisticalGraphB from './component/StatisticalGraphB';
import StatisticalGraphC from './component/StatisticalGraphC';
import StatisticalGraphD from './component/StatisticalGraphD';

const EditFolderModal = dynamic(
  () => import('@fastgpt/web/components/common/MyModal/EditFolderModal')
);

const CreateModal = dynamic(() => import('./component/CreateModal'));

const Dataset = () => {
  const { isPc } = useSystem();
  const { t } = useTranslation();
  const router = useRouter();
  const { parentId } = router.query as { parentId: string };

  const {
    myDatasets,
    paths,
    isFetchingDatasets,
    refetchPaths,
    loadMyDatasets,
    refetchFolderDetail,
    folderDetail,
    setEditedDataset,
    setMoveDatasetId,
    onDelDataset,
    onUpdateDataset
  } = useContextSelector(DatasetsContext, (v) => v);
  const { userInfo } = useUserStore();

  const [editFolderData, setEditFolderData] = useState<EditFolderFormType>();

  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal
  } = useDisclosure();

  return (
    <PageContainer
      isLoading={myDatasets.length === 0 && isFetchingDatasets}
      insertProps={{ px: folderDetail ? [4, 6] : [5, '10'] }}
    >
      <Flex pt={[4, 6]}>
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
            {userInfo?.team?.permission.hasWritePer && (
              <MyMenu
                offset={[-30, 5]}
                width={120}
                Button={null}
                menuList={[
                  {
                    children: [
                      {
                        label: (
                          <Flex>
                            <MyIcon name={FolderIcon} w={'20px'} mr={1} />
                            {t('common:Folder')}
                          </Flex>
                        ),
                        onClick: () => setEditFolderData({})
                      },
                      {
                        label: (
                          <Flex>
                            <Image src={'/imgs/workflow/db.png'} alt={''} w={'20px'} mr={1} />
                            {t('common:core.dataset.Dataset')}
                          </Flex>
                        ),
                        onClick: onOpenCreateModal
                      }
                    ]
                  }
                ]}
              />
            )}
          </Flex>
          <Box flexGrow={1}>
            <Grid
              flexGrow={1}
              py={5}
              gridTemplateColumns={['1fr', 'repeat(2,1fr)', 'repeat(3,1fr)', 'repeat(4,1fr)']}
              gridGap={5}
              userSelect={'none'}
            >
              <BlockWrapper>
                <StatisticalGraphA />
              </BlockWrapper>
              <BlockWrapper>
                <StatisticalGraphB />
              </BlockWrapper>
              <BlockWrapper>
                <StatisticalGraphC />
              </BlockWrapper>
              <BlockWrapper>
                <StatisticalGraphD />
              </BlockWrapper>
              <GridItem colSpan={4}>
                <BlockWrapper>
                  <RelationGraph />
                </BlockWrapper>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </Flex>
    </PageContainer>
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
