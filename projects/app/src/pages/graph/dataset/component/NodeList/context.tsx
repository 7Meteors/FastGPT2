import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { createContext, useContextSelector } from 'use-context-selector';
import { DatasetStatusEnum } from '@fastgpt/global/core/dataset/constants';
import { useRequest } from '@fastgpt/web/hooks/useRequest';
import { DatasetSchemaType } from '@fastgpt/global/core/dataset/type';
import { useDisclosure } from '@chakra-ui/react';
import { checkTeamWebSyncLimit } from '@/web/support/user/team/api';
import { postCreateTrainingUsage } from '@/web/support/wallet/usage/api';
import { postWebsiteSync } from '@/web/core/dataset/api';
import { getNodes } from '@/web/core/graph/api';
import dynamic from 'next/dynamic';
import { usePagination } from '@fastgpt/web/hooks/usePagination';
import { DatasetCollectionsListItemType } from '@/global/core/dataset/type';
import { useRouter } from 'next/router';
import { DatasetPageContext } from '@/web/core/dataset/context/datasetPageContext';

const WebSiteConfigModal = dynamic(() => import('./WebsiteConfig'));

type NodeListPageContextType = {
  openWebSyncConfirm: () => void;
  onOpenWebsiteModal: () => void;
  collections: DatasetCollectionsListItemType[];
  Pagination: () => JSX.Element;
  getData: (e: number) => void;
  total: number;
  isGetting: boolean;
  pageNum: number;
  pageSize: number;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

export const NodeListPageContext = createContext<NodeListPageContextType>({
  openWebSyncConfirm: function (): () => void {
    throw new Error('Function not implemented.');
  },
  onOpenWebsiteModal: function (): void {
    throw new Error('Function not implemented.');
  },
  collections: [],
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

const NodeListPageContextProvider = ({ children }: { children: ReactNode }) => {
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

  const [searchText, setSearchText] = useState('');
  const {
    data: collections,
    Pagination,
    total,
    getData,
    isLoading: isGetting,
    pageNum,
    pageSize
  } = usePagination<DatasetCollectionsListItemType>({
    api: getNodes,
    pageSize: 10,
    params: {
      name: searchText
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
    collections,
    Pagination,
    total,
    getData,
    isGetting,
    pageNum,
    pageSize
  };

  return (
    <NodeListPageContext.Provider value={contextValue}>
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
    </NodeListPageContext.Provider>
  );
};
export default NodeListPageContextProvider;
