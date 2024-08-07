import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const data = [
  ['2024-07-01', 25],
  ['2024-07-02', 34],
  ['2024-07-03', 18],
  ['2024-07-04', 29],
  ['2024-07-05', 33],
  ['2024-07-06', 22],
  ['2024-07-07', 37],
  ['2024-07-08', 15],
  ['2024-07-09', 32],
  ['2024-07-10', 26],
  ['2024-07-11', 31],
  ['2024-07-12', 20],
  ['2024-07-13', 35],
  ['2024-07-14', 28],
  ['2024-07-15', 23],
  ['2024-07-16', 30],
  ['2024-07-17', 39],
  ['2024-07-18', 17],
  ['2024-07-19', 33],
  ['2024-07-20', 21],
  ['2024-07-21', 36],
  ['2024-07-22', 19],
  ['2024-07-23', 34],
  ['2024-07-24', 27],
  ['2024-07-25', 40],
  ['2024-07-26', 22],
  ['2024-07-27', 38],
  ['2024-07-28', 16],
  ['2024-07-29', 31],
  ['2024-07-30', 25]
];

const StatisticalGraphC: React.FC = () => {
  const options = useMemo(() => {
    return {
      grid: {
        left: '0', // 左边距
        top: '25%', // 上边距
        right: '0',
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
          type: 'bar',
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
        近30天新增事件数
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
      <Box mt="2">日平均新增 16</Box>
    </Flex>
  );
};

export default StatisticalGraphC;
