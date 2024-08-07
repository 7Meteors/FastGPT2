import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const data = [
  { name: '消费者权益', value: 148 },
  { name: '环境保护', value: 321 },
  { name: '公共服务', value: 235 },
  { name: '交通管理', value: 478 },
  { name: '城市规划', value: 89 }
];

const StatisticalGraphD: React.FC = () => {
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
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          startAngle: 180,
          endAngle: 360,
          data
        }
      ]
    };
  }, []);

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
        style={{ height: 180 }}
      />
    </Flex>
  );
};

export default StatisticalGraphD;
