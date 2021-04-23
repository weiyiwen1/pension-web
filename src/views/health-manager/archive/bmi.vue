<template>
  <div id="bmiChart" :style="{width: '1000px', height: '500px'}" />
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
  },
  data() {
    return {
      tabVisible: false
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
      const testChart = echarts.init(document.getElementById('bmiChart'))
      // 绘制图表
      testChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['BMI指数']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2020-06', '2020-06', '2020-06', '2020-06', '2020-06', '2020-06']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: '体温',
            type: 'line',
            data: [22.5, 22.9, 22.6, 22.8, 22.6, 22.7],
            markPoint: {
              data: [
                { type: 'max', name: '最高' },
                { type: 'min', name: '最低' }
              ]
            }
          }
        ]
      })
    }
  }
}
</script>
