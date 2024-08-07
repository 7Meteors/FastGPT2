import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const data = [
  ['2023-08', 347],
  ['2023-09', 398],
  ['2023-10', 436],
  ['2023-11', 371],
  ['2023-12', 405],
  ['2024-01', 321],
  ['2024-02', 378],
  ['2024-03', 334],
  ['2024-04', 489],
  ['2024-05', 450],
  ['2024-06', 300],
  ['2024-07', 500]
];

const StatisticalGraphB: React.FC = () => {
  const options = useMemo(() => {
    return {
      grid: {
        left: '-5%', // 左边距
        top: '25%', // 上边距
        right: '-5%',
        bottom: '5%'
      },
      xAxis: { type: 'category', show: false },
      yAxis: { type: 'value', show: false },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line' // 鼠标悬浮时显示十字准线
        }
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true, // 折线带有弧度
          symbol: 'none', // 隐藏折线数据点
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#869dd5'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ])
            }
          }
        }
      ]
    };
  }, []);

  return (
    <Flex grow={1} flexDirection="column" justifyContent="space-between">
      <Text fontSize="18" fontWeight="bold" textTransform="uppercase">
        近12月新增事件数
      </Text>
      <ReactECharts
        echarts={echarts}
        option={options}
        notMerge={true}
        lazyUpdate={true}
        theme={'theme_name'}
        style={{ height: 140 }}
      />
      <hr />
      <Box mt="2">月平均新增 393</Box>
    </Flex>
  );
};

export default StatisticalGraphB;
