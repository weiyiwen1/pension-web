<template>
  <div class="app-container">
    <div style="width:70%;float:left">
      <baidu-map
        id="baidumap"
        class="map"
        ak="KbGbuknrQ3M9Ms9uwb260MpQAdBWmEjf"
        :center="map.center"
        :zoom="map.zoom"
        :scroll-wheel-zoom="map.scroll"
      >
        <bm-map-type
          :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
          anchor="BMAP_ANCHOR_TOP_RIGHT"
        ></bm-map-type>
        <!--比例尺控件-->
        <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
        <!--缩放控件-->
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>

        <bm-info-window
          :show="infoWindow.show"
          :position="infoWindow.position"
          class="info-window"
          @open="infoWindowOpen"
          @close="infoWindowClose"
        >
          <!--此处是自定义窗体内容，你也可以用{{}}的方式直接输出内容-->
          <div class="info-Window-name">{{infoWindow.title}}</div>
          <div
            v-for="(item,key) of infoWindow.contents"
            :key="key"
          >{{item}}</div>
        </bm-info-window>
      </baidu-map>
    </div>
    <div style="width:25%;float:right;font-size:12px;border:1px solid #dfe6ec;padding-left:10px;">
      <p>陈豁然（13791120516）</p>
      <p>襄阳市政府</p>
      <p><span style="color:red">[SOS报警] </span> <span style="margin-left:5px">2020-09-09 12:00:12</span></p>
      <div id='three_dot_view'>
        <label class="gray_line"></label>
      </div>
      <p>赵桂英（13969106917）</p>
      <p>天桥区水屯路74号</p>
      <p><span style="color:red">[SOS报警] </span> <span style="margin-left:5px">2020-09-08 15:01:41</span></p>
      <div id='three_dot_view'>
        <label class="gray_line"></label>
      </div>
      <p>王延生（15866751234）</p>
      <p>济南市市中区七里山南村四区</p>
      <p><span style="color:red">[SOS报警] </span> <span style="margin-left:5px">2020-09-09 12:00:12</span></p>
      <div id='three_dot_view'>
        <label class="gray_line"></label>
      </div>
      <p>王美娟（18653187875）</p>
      <p>济南市市中区济微公路85号</p>
      <p><span style="color:red">[SOS报警] </span> <span style="margin-left:5px">2020-09-09 12:00:12</span></p>
      <div id='three_dot_view'>
        <label class="gray_line"></label>
      </div>
      <p>冉庆会（13395313917）</p>
      <p>山东省济南市历下区轻后小区</p>
      <p><span style="color:red">[SOS报警] </span> <span style="margin-left:5px">2020-09-09 12:00:12</span></p>
      <div id='three_dot_view'>
        <label class="gray_line"></label>
      </div>
      <p>孙锡桐（15806661366）</p>
      <p>济南市历下区菜市新村33号楼</p>
      <p><span style="color:red">[SOS报警] </span> <span style="margin-left:5px">2020-09-09 12:00:12</span></p>
      <div id='three_dot_view'>
        <label class="gray_line"></label>
      </div>
    </div>
  </div>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";
import BmScale from "vue-baidu-map/components/controls/Scale";
import BmNavigation from "vue-baidu-map/components/controls/Navigation";
import BmMapType from "vue-baidu-map/components/controls/MapType.vue"; // 类型组件
export default {
  name: "Map",
  components: {
    BaiduMap,
    BmScale,
    BmNavigation,
    BmInfoWindow,
    BmMapType,
  },
  props: ["deviceInfo", "towerlineInfo"],
  data() {
    return {
      map: {
        center: { lng: 112.127671, lat: 32.015287 }, //'襄阳市',
        zoom: 15, //1-18
        scroll: true,
      },
      infoWindow: {
        show: true,
        position: {},
        title: "",
        contents: ["12", "121", "121212"],
      },
    };
  },

  methods: {
    clickDevice(data) {
      this.infoWindow.position = { lng: 112.127671, lat: 32.015287 };
      this.infoWindow.title = "";
      this.infoWindow.contents = [];
      this.infoWindow.contents.push(
        "联系方式：15789980989",
        "报警位置：襄阳市政府",
        "报警时间：2020-12-11 16：00",
        "既往病史："
      );
    },
    clickTower(data) {
      this.infoWindow.position = { lng: data.lng, lat: data.lat };
      this.infoWindow.title = data.towername;
      this.infoWindow.contents = [];
      this.infoWindow.contents.push(
        "线路名称：" + data.linename,
        "线路等级：" + data.vlevel,
        "经度：" + data.lng,
        "纬度：" + data.lat
      );
    },
    infoWindowClose() {
      this.infoWindow.show = false;
    },
    //type不同，初始化数据的方法不同
    infoWindowOpen(data, type) {
      this.infoWindow.show = true;
      this.clickDevice(data);
      switch (type) {
        case 1:
          this.clickDevice(data);
          break;
        case 2:
          this.clickTower(data);
          break;
      }
    },
  },
};
</script>

<style>
#three_dot_view {
  width: 330px;
  height: 20px;
}

.gray_line {
  background: #e5e5e5;
  width: 100%;
  height: 2px;
  float: left;
  margin: 10px 5px;
}

.map {
  width: 100%;
  height: 750px;
  margin: 0 20px 20px 20px;
  position: relative;
}
.map .info-window {
    font-size: 12px;

  }
 .map .info-window  .info-Window-name {
      font-weight: bold;
      text-align: center;
    }
</style>
