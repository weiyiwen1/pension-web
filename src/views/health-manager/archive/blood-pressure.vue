<template>
  <div id="bloodPressureChart" :style="{width: '1000px', height: '500px'}" />
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
  },
  data() {
    return {
    }
  },
  watch: {
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    showChart() {
      this.drawLine()
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const testChart = echarts.init(document.getElementById('bloodPressureChart'))
      // 绘制图表
      testChart.setOption({
        title: {
          text: '血压'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高气温', '最低气温']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: '最高气温',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '最低气温',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [
                { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' },
                [{
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max'
                }, {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: '最大值'
                  },
                  type: 'max',
                  name: '最高点'
                }]
              ]
            }
          }
        ]
      })
    }
  }
}
</script>
