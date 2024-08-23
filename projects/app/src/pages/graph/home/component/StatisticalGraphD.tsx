// @ts-nocheck
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { queryEventPieSummary } from '@/web/core/graph/api';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const StatisticalGraphD: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [pageData, setPageData] = React.useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      await queryEventPieSummary().then((res: any) => {
        setPageData(res?.data || []);
        setLoading(false);
      });
    }
    fetchData();
  }, []);

  const options = useMemo(() => {
    return {
      grid: {
        left: '0', // 左边距
        top: '0', // 上边距
        right: '0',
        bottom: '5%'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        show: false
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          startAngle: 180,
          endAngle: 360,
          data: pageData || []
        }
      ]
    };
  }, [pageData]);

  return (
    <Flex grow={1} flexDirection="column" justifyContent="space-between">
      <Text fontSize="18" fontWeight="bold" textTransform="uppercase">
        事件分类占比
      </Text>
      <ReactECharts
        echarts={echarts}
        option={options}
        notMerge={true}
        lazyUpdate={true}
        theme={'theme_name'}
        showLoading={loading}
        style={{ height: 180 }}
      />
    </Flex>
  );
};

export default StatisticalGraphD;
