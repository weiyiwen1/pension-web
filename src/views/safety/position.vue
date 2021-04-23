<template>
  <div class="app-container">
    <baidu-map :center="center" :zoom="zoom" style="height:1080px" :scroll-wheel-zoom="true" @ready="handler" @click="getClickInfo" />
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map'

export default {
  name: 'TestBaiDu',
  components: {
    BaiduMap
  },
  data() {
    return {
      center: { lng: 109.45744048529967, lat: 36.49771311230842 },
      zoom: 13
    }
  },
  methods: {
    handler({ BMap, map }) {
      var point = new BMap.Point(109.49926175379778, 36.60449676862417)
      map.centerAndZoom(point, 13)
      var marker = new BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中
      var circle = new BMap.Circle(point, 6, { strokeColor: 'Red', strokeWeight: 6, strokeOpacity: 1, Color: 'Red', fillColor: '#f03' })
      map.addOverlay(circle)
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    }
  }
}
</script>
