<template>
  <div
    id="bloodSugarChart"
    :style="{width: '1000px', height: '500px'}"
  />
</template>

<script>
import echarts from 'echarts'

export default {
  props: {},
  data() {
    return {}
  },
  watch: {},
  mounted() {
    this.drawLine()
  },
  methods: {
    showChart() {
      this.drawLine()
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const testChart = echarts.init(
        document.getElementById('bloodSugarChart')
      )
      // 绘制图表
      testChart.setOption({
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['早餐', '午餐', '晚餐', '夜间']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '早餐',
            type: 'line',
            data: [5.6, 5.8, 6.1, 5.6, 5.5, 6.1, 5.8]
          },
          {
            name: '午餐',
            type: 'line',
            data: [5.9, 5.3, 6.1, 5.8, 5.2, 5.1, 5.8]
          },
          {
            name: '晚餐',
            type: 'line',
            data: [5.6, 5.8, 6.3, 5.6, 5.5, 5.8, 5.6]
          },
          {
            name: '夜间',
            type: 'line',
            data: [5.1, 5.4, 5.3, 5.3, 5.9, 4.9, 5.2]
          }
        ]
      })
    }
  }
}
</script>
