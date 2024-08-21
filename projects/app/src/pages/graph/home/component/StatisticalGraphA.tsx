// @ts-nocheck
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

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const StatisticalGraphA: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [pageData, setPageData] = React.useState(
    {} as { total: number; caseClosed: number; caseRefused: number; caseToBeFiled: number }
  );

  useEffect(() => {
    async function fetchData() {
      await queryEventSummary().then((res) => {
        setPageData(res.data);
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
            <Stat style={{ flex: '0 0 30%' }}>
              <StatLabel>待立案</StatLabel>
              <StatNumber>{pageData?.caseToBeFiled || 0}</StatNumber>
              {/* <StatHelpText>
                <StatArrow type="increase" />
                {Number((100 * 1122) / 1560).toFixed(2)}%
              </StatHelpText> */}
            </Stat>
            <Stat style={{ flex: '0 0 30%' }}>
              <StatLabel>不立案</StatLabel>
              <StatNumber>{pageData?.caseRefused || 0}</StatNumber>
              {/* <StatHelpText>
                <StatArrow type="decrease" />
                {Number((100 * 438) / 1560).toFixed(2)}%
              </StatHelpText> */}
            </Stat>
            <Stat style={{ flex: '0 0 30%' }}>
              <StatLabel>结案</StatLabel>
              <StatNumber>{pageData?.caseClosed || 0}</StatNumber>
              {/* <StatHelpText>
                <StatArrow type="decrease" />
                {Number((100 * 438) / 1560).toFixed(2)}%
              </StatHelpText> */}
            </Stat>
          </StatGroup>
        </Flex>
        <hr />
        <Box mt="2">上月新增 423</Box>
      </Flex>
    </Spin>
  );
};

export default StatisticalGraphA;
