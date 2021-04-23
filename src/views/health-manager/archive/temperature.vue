<template>
  <div id="temperatureChart" :style="{width: '1000px', height: '500px'}" />
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
      const testChart = echarts.init(document.getElementById('temperatureChart'))
      // 绘制图表
      testChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['体温']
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
            name: '体温',
            type: 'line',
            data: [36.9, 36.8, 37, 36.4, 36.8, 38, 36.9],
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
