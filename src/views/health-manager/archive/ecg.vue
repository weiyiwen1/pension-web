<template>
  <div
    id="ecgChart"
    :style="{width: '1000px', height: '500px'}"
  />
</template>

<script>
import echarts from 'echarts'

export default {
  props: {},
  data() {
    return {
      tabVisible: false
    }
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
      const testChart = echarts.init(document.getElementById('ecgChart'))
      var xAxisData = []
      var yAxisData = []
      for (var i = 200; i > 0; i--) {
        xAxisData.push(i + '秒前')
      }
      for (i = 1; i < 201; i++) {
        yAxisData.push(Math.round(Math.random() * 1000))
      }

      yAxisData.push(Math.round(Math.random() * 1000))
      yAxisData.shift()
      // 绘制图表
      testChart.setOption({
        backgroundColor: '#ffffff',
        animation: false,
        title: {
          text: '总流量（kbps）' /*,
          left:'110px'*/
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: 50,
          right: 15
        },
        legend: {
          data: ['当前流量'],
          textStyle: { color: '#66b3ff' }
        },
        xAxis: {
          boundaryGap: false,
          data: xAxisData,
          splitLine: { show: true }
        },
        yAxis: {
          boundaryGap: false,
          splitLine: { show: true }
        },
        series: {
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#92c2ff'
              },
              color: '#66b3ff'
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#66b3ff' },
                { offset: 1, color: '#ecf5ff' }
              ])
            }
          },
          symbol: 'none',
          name: '当前流量',
          type: 'line',
          data: yAxisData
        }
      })
    }
  }
}
</script>
