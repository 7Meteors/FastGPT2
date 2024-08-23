// @ts-nocheck
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getLinks, getNodes } from '@/web/core/graph/api';
import { NodeTypeMap } from '../../dataset';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const categoriesMap: { [k: string]: any } = {
  bigcategory: {
    category: 0
  },
  smallcategory: {
    category: 1
  },
  event: {
    category: 2
    // symbolSize: [30, 25],
  }
};

const graph = {};

const RelationGraph: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const [resNodes, resLinks] = await Promise.all([getNodes(), getLinks()]);
      setNodes(
        resNodes.data.map(function (item) {
          return {
            id: item.id,
            name: item.name,
            ...categoriesMap[item.type]
          };
        })
      );
      setLinks(resLinks.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef?.current && chartRef?.current?.getEchartsInstance()) {
      // 获取ECharts实例
      const myChart = chartRef.current.getEchartsInstance();

      // 绑定点击事件
      myChart.on(
        'mouseup',
        function (params: { dataIndex: string | number; event: { offsetX: any; offsetY: any } }) {
          var option = myChart.getOption();
          option.series[0].data[params.dataIndex].x = params.event.offsetX;
          option.series[0].data[params.dataIndex].y = params.event.offsetY;
          option.series[0].data[params.dataIndex].fixed = true;
          myChart.setOption(option);
        }
      );
    }
  }, []);

  const options = useMemo(() => {
    return {
      title: {
        text: '上报事件关系图谱',
        subtext: '可以拖拽节点来查看不同部分的详细信息，并通过滚轮缩放来调整视图大小',
        top: 'top',
        left: 'left'
      },
      legend: [
        {
          data: ['大类', '小类', '事件']
        }
      ],
      animation: false, // 关闭初始化动画
      series: [
        {
          name: '图谱',
          type: 'graph',
          fit: true,
          animation: false,
          draggable: true,
          legendHoverLink: false,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 6],
          edgeLabel: {
            normal: {
              textStyle: {
                fontSize: 20
              }
            }
          },
          categories: [
            { name: '大类', symbolSize: 40 },
            { name: '小类', symbolSize: 30 },
            {
              name: '事件',
              symbol: 'roundRect',
              symbolSize: [16, 16],
              label: { show: true, position: 'inside' }
            }
          ],
          labelLayout: {
            hideOverlap: true
          },
          // force: {
          // initLayout: 'circular'
          // repulsion: 20,
          // edgeLength: 5,
          // repulsion: 20,
          // gravity: 0.2
          // },
          // force: {
          //   repulsion: 1000,
          //   gravity: 0.4,
          //   edgeLength: [10, 30],
          //   layoutAnimation: false
          // },
          roam: true,
          layout: 'force',
          data: nodes,
          links: links,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}'
          },
          emphasis: {
            focus: 'adjacency',
            label: {
              show: true,
              position: 'inside',
              formatter: '{b}'
            }
          }
        }
      ]
    };
  }, [links, nodes]);

  return (
    <ReactECharts
      echarts={echarts}
      option={options}
      ref={chartRef}
      showLoading={loading}
      // notMerge={true}
      // lazyUpdate={true}
      // theme={'theme_name'}
      style={{ height: 'calc(100vh - 420px)', minHeight: 500 }}
    />
  );
};

export default RelationGraph;
