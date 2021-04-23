<template>
  <div id="bloodFatChart" :style="{width: '1000px', height: '500px'}" />
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
      const testChart = echarts.init(document.getElementById('bloodFatChart'))
      // 绘制图表
      testChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['血脂']
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
            name: '胆固醇',
            type: 'line',
            data: [4.7, 4.5, 3.9, 4.1, 4.4, 3.8, 4.1]
          }, {
            name: '甘油三酯',
            type: 'line',
            data: [2.0, 1.8, 1.9, 1.8, 2.2, 1.9, 1.8]
          }
        ]
      })
    }
  }
}
</script>
