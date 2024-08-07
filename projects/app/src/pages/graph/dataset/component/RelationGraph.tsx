import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer]);

const graph = {
  nodes: [
    // 事件大类节点
    {
      id: 'c1',
      name: '消费者权益',
      category: 0
    },
    {
      id: 'c2',
      name: '环境保护',
      category: 0
    },
    {
      id: 'c3',
      name: '公共服务',
      category: 0
    },
    {
      id: 'c4',
      name: '交通管理',
      category: 0
    },
    {
      id: 'c5',
      name: '城市规划',
      category: 0
    },
    // 事件小类节点
    { id: 's1_1', name: '商品虚假宣传', category: 1 },
    { id: 's1_2', name: '售后服务不佳', category: 1 },
    { id: 's1_3', name: '价格欺诈', category: 1 },
    { id: 's1_4', name: '食品安全问题', category: 1 },
    { id: 's1_5', name: '假冒伪劣产品', category: 1 },

    // 环境保护小类
    { id: 's2_1', name: '工业废水排放', category: 1 },
    { id: 's2_2', name: '空气污染', category: 1 },
    { id: 's2_3', name: '噪音扰民', category: 1 },
    { id: 's2_4', name: '非法砍伐森林', category: 1 },
    { id: 's2_5', name: '土壤污染', category: 1 },
    { id: 's2_6', name: '野生动物保护', category: 1 },

    // 公共服务小类
    { id: 's3_1', name: '供水服务中断', category: 1 },
    { id: 's3_2', name: '供电不稳定', category: 1 },
    { id: 's3_3', name: '公共交通延误', category: 1 },
    { id: 's3_4', name: '医疗资源不足', category: 1 },
    { id: 's3_5', name: '教育资源分配不均', category: 1 },

    // 交通管理小类
    { id: 's4_1', name: '交通拥堵', category: 1 },
    { id: 's4_2', name: '停车难', category: 1 },
    { id: 's4_3', name: '交通信号灯故障', category: 1 },
    { id: 's4_4', name: '交通事故频发', category: 1 },
    { id: 's4_5', name: '交通规划不合理', category: 1 },

    // 城市规划小类
    { id: 's5_1', name: '城市绿化不足', category: 1 },
    { id: 's5_2', name: '公共设施缺乏', category: 1 },
    { id: 's5_3', name: '住宅区规划不合理', category: 1 },
    { id: 's5_4', name: '商业区噪音问题', category: 1 },
    { id: 's5_5', name: '城市排水系统缺陷', category: 1 },

    // 事件地址节点，这里列出部分示例
    { id: 'a1', name: '上城区湖滨街道', category: 2 },
    { id: 'a2', name: '下城区天水街道', category: 2 },
    { id: 'a3', name: '江干区凯旋街道', category: 2 },
    { id: 'a4', name: '拱墅区祥符街道', category: 2 },
    { id: 'a5', name: '西湖区留下街道', category: 2 },
    { id: 'a6', name: '滨江区西兴街道', category: 2 },
    { id: 'a7', name: '萧山区北干街道', category: 2 },
    { id: 'a8', name: '余杭区南苑街道', category: 2 },
    { id: 'a9', name: '富阳区富春街道', category: 2 },
    { id: 'a10', name: '临安区锦城街道', category: 2 },
    { id: 'a11', name: '建德市新安江街道', category: 2 },
    { id: 'a12', name: '桐庐县桐君街道', category: 2 },
    { id: 'a13', name: '淳安县千岛湖镇', category: 2 },
    { id: 'a14', name: '西湖区灵隐街道', category: 2 },
    { id: 'a15', name: '滨江区浦沿街道', category: 2 },
    { id: 'a16', name: '萧山区宁围街道', category: 2 },
    { id: 'a17', name: '余杭区良渚街道', category: 2 },
    { id: 'a18', name: '富阳区东洲街道', category: 2 },
    { id: 'a19', name: '临安区青山湖街道', category: 2 },
    { id: 'a20', name: '上城区望江街道', category: 2 },
    { id: 'a21', name: '下城区文晖街道', category: 2 },
    { id: 'a22', name: '江干区九堡街道', category: 2 },
    { id: 'a23', name: '拱墅区半山街道', category: 2 },
    { id: 'a24', name: '西湖区三墩镇', category: 2 },
    { id: 'a25', name: '滨江区滨兴街道', category: 2 },
    { id: 'a26', name: '萧山区瓜沥镇', category: 2 },
    { id: 'a27', name: '余杭区塘栖镇', category: 2 },
    { id: 'a28', name: '富阳区春江街道', category: 2 },
    { id: 'a29', name: '临安区高虹镇', category: 2 },
    { id: 'a30', name: '上城区南星街道', category: 2 },
    { id: 'a31', name: '下城区潮鸣街道', category: 2 },
    { id: 'a32', name: '江干区丁兰街道', category: 2 },
    { id: 'a33', name: '拱墅区康桥街道', category: 2 },
    { id: 'a34', name: '西湖区转塘街道', category: 2 },
    { id: 'a35', name: '滨江区江陵街道', category: 2 },
    { id: 'a36', name: '萧山区义桥镇', category: 2 },
    { id: 'a37', name: '余杭区仓前街道', category: 2 },
    { id: 'a38', name: '富阳区鹿山街道', category: 2 },
    { id: 'a39', name: '临安区太湖源镇', category: 2 },
    { id: 'a40', name: '上城区凯旋街道', category: 2 },
    { id: 'a41', name: '下城区东新街道', category: 2 },
    { id: 'a42', name: '江干区笕桥街道', category: 2 },
    { id: 'a43', name: '拱墅区大关街道', category: 2 },
    { id: 'a44', name: '西湖区蒋村街道', category: 2 },
    { id: 'a45', name: '滨江区浦沿街道', category: 2 },
    { id: 'a46', name: '萧山区新塘街道', category: 2 },
    { id: 'a47', name: '余杭区五常街道', category: 2 },
    { id: 'a48', name: '富阳区银湖街道', category: 2 },
    { id: 'a49', name: '临安区板桥镇', category: 2 },
    { id: 'a50', name: '上城区小营街道', category: 2 }
  ],
  links: [
    // 链接事件大类和事件小类
    { source: 'c1', target: 's1_1' },
    { source: 'c1', target: 's1_2' },
    { source: 'c1', target: 's1_3' },
    { source: 'c1', target: 's1_4' },
    { source: 'c1', target: 's1_5' },
    { source: 'c2', target: 's2_1' },
    { source: 'c2', target: 's2_2' },
    { source: 'c2', target: 's2_3' },
    { source: 'c2', target: 's2_4' },
    { source: 'c2', target: 's2_5' },
    { source: 'c2', target: 's2_6' },
    { source: 'c3', target: 's3_1' },
    { source: 'c3', target: 's3_2' },
    { source: 'c3', target: 's3_3' },
    { source: 'c3', target: 's3_4' },
    { source: 'c3', target: 's3_5' },
    { source: 'c4', target: 's4_1' },
    { source: 'c4', target: 's4_2' },
    { source: 'c4', target: 's4_3' },
    { source: 'c4', target: 's4_4' },
    { source: 'c4', target: 's4_5' },
    { source: 'c5', target: 's5_1' },
    { source: 'c5', target: 's5_2' },
    { source: 'c5', target: 's5_3' },
    { source: 'c5', target: 's5_4' },
    { source: 'c5', target: 's5_5' },

    // 链接事件小类和事件地址
    { source: 's1_1', target: 'a1' },
    { source: 's1_2', target: 'a2' },
    { source: 's1_3', target: 'a3' },
    { source: 's1_4', target: 'a4' },
    { source: 's1_5', target: 'a5' },
    { source: 's2_1', target: 'a6' },
    { source: 's2_2', target: 'a7' },
    { source: 's2_3', target: 'a8' },
    { source: 's2_4', target: 'a9' },
    { source: 's2_5', target: 'a10' },
    { source: 's2_6', target: 'a11' },
    { source: 's3_1', target: 'a12' },
    { source: 's3_2', target: 'a13' },
    { source: 's3_3', target: 'a14' },
    { source: 's3_4', target: 'a15' },
    { source: 's3_5', target: 'a16' },
    { source: 's4_1', target: 'a17' },
    { source: 's4_2', target: 'a18' },
    { source: 's4_3', target: 'a19' },
    { source: 's4_4', target: 'a20' },
    { source: 's4_5', target: 'a21' },
    { source: 's5_1', target: 'a22' },
    { source: 's5_2', target: 'a23' },
    { source: 's5_3', target: 'a24' },
    { source: 's5_4', target: 'a25' },
    { source: 's5_5', target: 'a26' },
    { source: 's2_5', target: 'a45' },
    { source: 's2_6', target: 'a46' },
    { source: 's3_1', target: 'a47' },
    { source: 's3_2', target: 'a48' },
    { source: 's3_3', target: 'a49' },
    { source: 's3_4', target: 'a1' },
    { source: 's3_5', target: 'a2' },
    { source: 's4_1', target: 'a3' },
    { source: 's4_2', target: 'a4' },
    { source: 's4_3', target: 'a5' },
    { source: 's4_4', target: 'a6' },
    { source: 's4_5', target: 'a7' },
    { source: 's5_1', target: 'a8' },
    { source: 's5_2', target: 'a9' },
    { source: 's5_3', target: 'a10' },
    { source: 's5_4', target: 'a11' },
    { source: 's4_5', target: 'a22' },
    { source: 's1_3', target: 'a12' },
    { source: 's5_1', target: 'a12' }
  ],
  categories: [
    { name: '事件大类', symbolSize: 80 },
    { name: '事件小类', symbolSize: 60 },
    {
      name: '事件地址',
      shape: 'rect',
      symbol: 'rect',
      width: 100,
      height: 20,
      symbolSize: [100, 20]
    }
  ]
};

const RelationGraph: React.FC = () => {
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
          data: graph.nodes.map((item) =>
            item.category === 2
              ? {
                  ...item,
                  symbol: 'rect',
                  symbolSize: [100, 20]
                }
              : item
          ),
          links: graph.links,
          categories: graph.categories,
          label: {
            show: true,
            formatter: '{b}'
          }
        }
      ]
    };
  }, []);

  return (
    <ReactECharts
      echarts={echarts}
      option={options}
      notMerge={true}
      lazyUpdate={true}
      theme={'theme_name'}
      style={{ height: 'calc(100vh - 480px)', minHeight: 700 }}
    />
  );
};

export default RelationGraph;
