import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { queryEventTimeline } from '@/web/core/graph/api';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const StatisticalGraphC: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState([] as any[]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      await queryEventTimeline().then((res: any) => {
        setAverage(res?.average || 0);
        setPageData(res?.data);
        setLoading(false);
      });
    }
    fetchData();
  }, []);

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
          data: pageData || [],
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
  }, [pageData]);

  return (
    <Flex grow={1} flexDirection="column" justifyContent="space-between">
      <Text fontSize="18" fontWeight="bold" textTransform="uppercase">
        近12月新增事件数
      </Text>
      <ReactECharts
        echarts={echarts}
        option={options}
        notMerge={true}
        showLoading={loading}
        lazyUpdate={true}
        theme={'theme_name'}
        style={{ height: 140 }}
      />
      <hr />
      <Box mt="2">月平均新增 {average || 0}</Box>
    </Flex>
  );
};

export default StatisticalGraphC;
