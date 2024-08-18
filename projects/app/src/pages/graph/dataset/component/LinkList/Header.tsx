import React, { useCallback, useRef } from 'react';
import { Box, Flex, MenuButton, Button, Link, useTheme, useDisclosure } from '@chakra-ui/react';
import {
  getDatasetCollectionPathById,
  postDatasetCollection,
  putDatasetCollectionById
} from '@/web/core/dataset/api';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useTranslation } from 'next-i18next';
import MyIcon from '@fastgpt/web/components/common/Icon';
import MyInput from '@/components/MyInput';
import { useRequest } from '@fastgpt/web/hooks/useRequest';
import { useRouter } from 'next/router';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import MyMenu from '@fastgpt/web/components/common/MyMenu';
import { useEditTitle } from '@/web/common/hooks/useEditTitle';
import {
  DatasetCollectionTypeEnum,
  TrainingModeEnum,
  DatasetTypeMap,
  DatasetStatusEnum
} from '@fastgpt/global/core/dataset/constants';
import EditFolderModal, { useEditFolder } from '../../../component/EditFolderModal';
import { DatasetTypeEnum } from '../../index';
import ParentPath from '@/components/common/ParentPaths';
import dynamic from 'next/dynamic';

import { ImportDataSourceEnum } from '@fastgpt/global/core/dataset/constants';
import { useContextSelector } from 'use-context-selector';
import { LinkListPageContext } from './context';
import { DatasetPageContext } from '@/web/core/dataset/context/datasetPageContext';
import { useSystem } from '@fastgpt/web/hooks/useSystem';

const Header = ({}: {}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { setLoading } = useSystemStore();
  const datasetDetail = useContextSelector(DatasetPageContext, (v) => v.datasetDetail);

  const router = useRouter();
  const { parentId = '' } = router.query as { parentId: string };
  const { isPc } = useSystem();

  const lastSearch = useRef('');
  const { searchText, setSearchText, total, getData, pageNum, onOpenWebsiteModal } =
    useContextSelector(LinkListPageContext, (v) => v);

  // change search
  const debounceRefetch = useCallback(
    debounce(() => {
      getData(1);
      lastSearch.current = searchText;
    }, 300),
    []
  );

  const { data: paths = [] } = useQuery(['getDatasetCollectionPathById', parentId], () =>
    getDatasetCollectionPathById(parentId)
  );

  const { editFolderData, setEditFolderData } = useEditFolder();
  const { onOpenModal: onOpenCreateVirtualFileModal, EditModal: EditCreateVirtualFileModal } =
    useEditTitle({
      title: t('common:dataset.Create manual collection'),
      tip: t('common:dataset.Manual collection Tip'),
      canEmpty: false
    });
  const {
    isOpen: isOpenFileSourceSelector,
    onOpen: onOpenFileSourceSelector,
    onClose: onCloseFileSourceSelector
  } = useDisclosure();
  const { mutate: onCreateCollection } = useRequest({
    mutationFn: async ({
      name,
      type,
      callback,
      ...props
    }: {
      name: string;
      type: DatasetCollectionTypeEnum;
      callback?: (id: string) => void;
      trainingType?: TrainingModeEnum;
      rawLink?: string;
      chunkSize?: number;
    }) => {
      setLoading(true);
      const id = await postDatasetCollection({
        parentId,
        datasetId: datasetDetail._id,
        name,
        type,
        ...props
      });
      callback?.(id);
      return id;
    },
    onSuccess() {
      getData(pageNum);
    },
    onSettled() {
      setLoading(false);
    },

    successToast: t('common:common.Create Success'),
    errorToast: t('common:common.Create Failed')
  });

  return (
    <Flex px={[2, 6]} alignItems={'flex-start'} h={'35px'}>
      <Box flex={1}>
        <ParentPath
          paths={paths.map((path, i) => ({
            parentId: path.parentId,
            parentName: i === paths.length - 1 ? `${path.parentName}` : path.parentName
          }))}
          FirstPathDom={
            <>
              <Box fontWeight={'bold'} fontSize={['sm', 'md']}>
                {t(DatasetTypeMap[datasetDetail?.type]?.collectionLabel as any)}({total})
              </Box>
              {datasetDetail?.websiteConfig?.url && (
                <Flex fontSize={'sm'}>
                  {t('common:core.dataset.website.Base Url')}:
                  <Link
                    href={datasetDetail.websiteConfig.url}
                    target="_blank"
                    mr={2}
                    textDecoration={'underline'}
                    color={'primary.600'}
                  >
                    {datasetDetail.websiteConfig.url}
                  </Link>
                </Flex>
              )}
            </>
          }
          onClick={(e) => {
            router.replace({
              query: {
                ...router.query,
                parentId: e
              }
            });
          }}
        />
      </Box>

      {/* search input */}
      {isPc && (
        <Flex alignItems={'center'} mr={4}>
          <MyInput
            bg={'myGray.50'}
            w={['100%', '250px']}
            size={'sm'}
            h={'36px'}
            placeholder={t('common:common.Search') || ''}
            value={searchText}
            leftIcon={
              <MyIcon
                name="common/searchLight"
                position={'absolute'}
                w={'16px'}
                color={'myGray.500'}
              />
            }
            onChange={(e) => {
              setSearchText(e.target.value);
              debounceRefetch();
            }}
            onBlur={() => {
              if (searchText === lastSearch.current) return;
              getData(1);
            }}
            onKeyDown={(e) => {
              if (searchText === lastSearch.current) return;
              if (e.key === 'Enter') {
                getData(1);
              }
            }}
          />
        </Flex>
      )}
      <Button colorScheme="blue">新建关联</Button>

      {/* modal */}
      {!!editFolderData && (
        <EditFolderModal
          onClose={() => setEditFolderData(undefined)}
          editCallback={async (name) => {
            try {
              if (editFolderData.id) {
                await putDatasetCollectionById({
                  id: editFolderData.id,
                  name
                });
                getData(pageNum);
              } else {
                onCreateCollection({
                  name,
                  type: DatasetCollectionTypeEnum.folder
                });
              }
            } catch (error) {
              return Promise.reject(error);
            }
          }}
          isEdit={!!editFolderData.id}
          name={editFolderData.name}
        />
      )}
      <EditCreateVirtualFileModal iconSrc={'modal/manualDataset'} closeBtnText={''} />
      {isOpenFileSourceSelector && <FileSourceSelector onClose={onCloseFileSourceSelector} />}
    </Flex>
  );
};

export default Header;
