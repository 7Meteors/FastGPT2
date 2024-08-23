import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useEffect } from 'react';
import {
  Box,
  Flex,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text
} from '@chakra-ui/react';
import { queryEventSummary } from '@/web/core/graph/api';
import { Spin } from 'antd';
import { UrgencyMap } from '../../dataset/component/EventListTable';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const StatisticalGraphA: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [pageData, setPageData] = React.useState(
    {} as { total: number; urgency: { [x: string]: number }; lastMonth: number }
  );

  useEffect(() => {
    async function fetchData() {
      await queryEventSummary().then((res: any) => {
        setPageData(res?.data);
        setLoading(false);
      });
    }
    fetchData();
  }, []);

  return (
    <Spin spinning={loading}>
      <Flex grow={1} flexDirection="column" justifyContent="space-between">
        <Text fontSize="18" fontWeight="bold" textTransform="uppercase">
          总事件数
        </Text>
        <Text fontSize="2xl" color="green.500">
          {pageData?.total || 0}
        </Text>
        <Flex grow={1} alignItems="center" height={102}>
          <StatGroup style={{ flex: 1, justifyContent: 'start' }}>
            <Stat style={{ flex: '0 0 25%' }}>
              <StatLabel>紧急</StatLabel>
              <StatNumber style={{ color: UrgencyMap.jy.color }}>
                {pageData?.urgency?.jy || 0}
              </StatNumber>
            </Stat>
            <Stat style={{ flex: '0 0 25%' }}>
              <StatLabel>严重</StatLabel>
              <StatNumber style={{ color: UrgencyMap.yz.color }}>
                {pageData?.urgency?.yz || 0}
              </StatNumber>
            </Stat>
            <Stat style={{ flex: '0 0 25%' }}>
              <StatLabel>一般</StatLabel>
              <StatNumber>{pageData?.urgency?.yb || 0}</StatNumber>
            </Stat>
            <Stat style={{ flex: '0 0 25%' }}>
              <StatLabel>轻度</StatLabel>
              <StatNumber>{pageData?.urgency?.qd || 0}</StatNumber>
            </Stat>
          </StatGroup>
        </Flex>
        <hr />
        <Box mt="2">上月新增 {pageData?.lastMonth || 0}</Box>
      </Flex>
    </Spin>
  );
};

export default StatisticalGraphA;
