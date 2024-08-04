import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const graph = {
  nodes: [
    {
      id: '0',
      name: 'Tom Hanks',
      category: 0
    },
    {
      id: '1',
      name: 'Leonardo DiCaprio',
      category: 0
    },
    {
      id: '2',
      name: 'Catch Me If You Can',
      category: 1
    },
    {
      id: '3',
      name: 'The Revenant',
      category: 1
    }
  ],
  links: [
    {
      source: '0',
      target: '2',
      label: {
        show: true
      }
    },
    {
      source: '1',
      target: '2',
      label: {
        show: true
      }
    },
    {
      source: '1',
      target: '3',
      label: {
        show: true
      }
    }
  ],
  categories: [
    {
      name: '人物'
    },
    {
      name: '作品'
    }
  ]
};

const StatisticalGraph1: React.FC = () => {
  const options = useMemo(() => {
    return {
      grid: {
        left: '10%', // 左边距
        top: '10%', // 上边距
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {}
        }
      ]
    };
  }, []);

  return (
    <>
      <label>图表标题</label>
      <ReactECharts
        echarts={echarts}
        option={options}
        notMerge={true}
        lazyUpdate={true}
        theme={'theme_name'}
        style={{ height: 200 }}
      />
    </>
  );
};

export default StatisticalGraph1;
