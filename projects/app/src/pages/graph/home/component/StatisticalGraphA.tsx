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
import { querySummary } from '@/web/core/graph/api';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const StatisticalGraphA: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [pageData, setPageData] = React.useState({});

  useEffect(() => {
    async function fetchData() {
      await querySummary().then((res) => {
        console.log(res);
      });
    }
    fetchData();
  }, []);

  return (
    <Flex grow={1} flexDirection="column" justifyContent="space-between">
      <Text fontSize="18" fontWeight="bold" textTransform="uppercase">
        总事件数
      </Text>
      <Text fontSize="2xl" color="green.500">
        1,560
      </Text>
      <Flex grow={1} alignItems="center">
        <StatGroup>
          <Stat>
            <StatLabel>已处理</StatLabel>
            <StatNumber>1,122</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {Number((100 * 1122) / 1560).toFixed(2)}%
            </StatHelpText>
          </Stat>

          <Stat ml={20}>
            <StatLabel>待处理</StatLabel>
            <StatNumber>438</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              {Number((100 * 438) / 1560).toFixed(2)}%
            </StatHelpText>
          </Stat>
        </StatGroup>
      </Flex>
      <hr />
      <Box mt="2">上月新增 423</Box>
    </Flex>
  );
};

export default StatisticalGraphA;
