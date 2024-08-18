import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { createContext, useContextSelector } from 'use-context-selector';
import { DatasetStatusEnum, DatasetTypeEnum } from '@fastgpt/global/core/dataset/constants';
import { useRequest } from '@fastgpt/web/hooks/useRequest';
import { DatasetSchemaType } from '@fastgpt/global/core/dataset/type';
import { useDisclosure } from '@chakra-ui/react';
import { checkTeamWebSyncLimit } from '@/web/support/user/team/api';
import { postCreateTrainingUsage } from '@/web/support/wallet/usage/api';
import { getDatasetCollections, postWebsiteSync } from '@/web/core/dataset/api';
import { deleteNode, editNode, getLinks, newNode } from '@/web/core/graph/api';
import dynamic from 'next/dynamic';
import { usePagination } from '@fastgpt/web/hooks/usePagination';
import { DatasetCollectionsListItemType } from '@/global/core/dataset/type';
import { useRouter } from 'next/router';
import { DatasetPageContext } from '@/web/core/dataset/context/datasetPageContext';

const WebSiteConfigModal = dynamic(() => import('./WebsiteConfig'));

type LinkListPageContextType = {
  openWebSyncConfirm: () => void;
  onOpenWebsiteModal: () => void;
  links: DatasetCollectionsListItemType[];
  Pagination: () => JSX.Element;
  getData: (e: number) => void;
  total: number;
  isGetting: boolean;
  pageNum: number;
  pageSize: number;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

export const LinkListPageContext = createContext<LinkListPageContextType>({
  openWebSyncConfirm: function (): () => void {
    throw new Error('Function not implemented.');
  },
  onOpenWebsiteModal: function (): void {
    throw new Error('Function not implemented.');
  },
  links: [],
  Pagination: function (): JSX.Element {
    throw new Error('Function not implemented.');
  },
  total: 0,
  getData: function (e: number): void {
    throw new Error('Function not implemented.');
  },
  isGetting: false,
  pageNum: 0,
  pageSize: 10,
  searchText: '',
  setSearchText: function (value: SetStateAction<string>): void {
    throw new Error('Function not implemented.');
  }
});

const LinkListPageContextProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { parentId = '' } = router.query as { parentId: string };

  const { datasetDetail, datasetId, updateDataset } = useContextSelector(
    DatasetPageContext,
    (v) => v
  );

  const { openConfirm: openWebSyncConfirm, ConfirmModal: ConfirmWebSyncModal } = useConfirm({
    content: t('common:core.dataset.collection.Start Sync Tip')
  });

  const {
    isOpen: isOpenWebsiteModal,
    onOpen: onOpenWebsiteModal,
    onClose: onCloseWebsiteModal
  } = useDisclosure();
  const { mutate: onUpdateDatasetWebsiteConfig } = useRequest({
    mutationFn: async (websiteConfig: DatasetSchemaType['websiteConfig']) => {
      onCloseWebsiteModal();
      await checkTeamWebSyncLimit();
      await updateDataset({
        id: datasetId,
        websiteConfig,
        status: DatasetStatusEnum.syncing
      });
      const billId = await postCreateTrainingUsage({
        name: t('common:core.dataset.training.Website Sync'),
        datasetId: datasetId
      });
      await postWebsiteSync({ datasetId: datasetId, billId });

      return;
    },
    errorToast: t('common:common.Update Failed')
  });

  // collection list
  const [searchText, setSearchText] = useState('');
  const {
    data: links,
    Pagination,
    total,
    getData,
    isLoading: isGetting,
    pageNum,
    pageSize
  } = usePagination<DatasetCollectionsListItemType>({
    api: getLinks,
    pageSize: 10,
    params: {
      searchText
    },
    defaultRequest: false
  });
  useEffect(() => {
    getData(1);
  }, [getData]);

  const contextValue: any = {
    openWebSyncConfirm: openWebSyncConfirm(onUpdateDatasetWebsiteConfig),
    onOpenWebsiteModal,

    searchText,
    setSearchText,
    links,
    Pagination,
    total,
    getData,
    isGetting,
    pageNum,
    pageSize
  };

  return (
    <LinkListPageContext.Provider value={contextValue}>
      {children}
      {isOpenWebsiteModal && (
        <WebSiteConfigModal
          onClose={onCloseWebsiteModal}
          onSuccess={onUpdateDatasetWebsiteConfig}
          defaultValue={{
            url: datasetDetail?.websiteConfig?.url,
            selector: datasetDetail?.websiteConfig?.selector
          }}
        />
      )}
      <ConfirmWebSyncModal />
    </LinkListPageContext.Provider>
  );
};
export default LinkListPageContextProvider;
