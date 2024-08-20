import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { getLinks, getNodes } from '@/web/core/graph/api';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const graph = {
  categories: [{ name: 'bigcategory' }, { name: 'smallcategory' }, { name: 'event' }]
};

const RelationGraph: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    getNodes().then((res) => {
      setNodes(
        res.data.map(function (item) {
          return {
            id: item.id,
            name: item.name,
            category: item.type
          };
        })
      );
    });
    getLinks().then((res) => {
      setLinks(
        res.data.map((item: { r: { startNodeElementId: string; endNodeElementId: string } }) => ({
          source: item.r.startNodeElementId,
          target: item.r.endNodeElementId
        }))
      );
    });
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
          data: graph.categories.map(function (a) {
            return a.name;
          })
        }
      ],
      animation: false, // 关闭初始化动画
      series: [
        {
          name: '图谱',
          type: 'graph',
          fit: true,
          draggable: true,
          legendHoverLink: false,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            normal: {
              textStyle: {
                fontSize: 20
              }
            }
          },
          force: {
            repulsion: 1000,
            gravity: 0.4,
            edgeLength: [10, 30],
            layoutAnimation: false
          },
          roam: true,
          layout: 'force',
          data: nodes,
          links: links,
          categories: graph.categories,
          label: {
            show: true,
            formatter: '{b}'
          }
        }
      ]
    };
  }, [links, nodes]);

  return (
    <ReactECharts
      echarts={echarts}
      option={options}
      // notMerge={true}
      // lazyUpdate={true}
      // theme={'theme_name'}
      style={{ height: 'calc(100vh - 420px)', minHeight: 500 }}
    />
  );
};

export default RelationGraph;
