<!-- @format -->

<template>
	<div>
		<div>
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
					<div class="info-Window-name"
					style="font-size:12px">{{ infoWindow.title }}</div>
					<div style="font-size:12px;margin-top:5px" v-for="(item, key) of infoWindow.contents" :key="key">
						<span style="padding:5px">{{ item }}</span></div>
				</bm-info-window>
			</baidu-map>
		</div>
	</div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow.vue';
import BmScale from 'vue-baidu-map/components/controls/Scale';
import BmNavigation from 'vue-baidu-map/components/controls/Navigation';
export default {
	components: {
		BaiduMap,
		BmScale,
		BmNavigation,
		BmInfoWindow
	},
	props: ['deviceInfo', 'towerlineInfo'],
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
				title: '',
				contents: ['12', '121', '121212'],
			},
		};
	},
	methods: {
		clickDevice(data) {
			this.infoWindow.position = { lng: 112.127671, lat: 32.015287 };
			this.infoWindow.title = '';
			this.infoWindow.contents = [];
			this.infoWindow.contents.push(
				'老人姓名：李丽',
				'联系方式：13157678997',
				'家庭地址：襄阳市明湖公寓'
			);
		},
		clickTower(data) {
			this.infoWindow.position = { lng: data.lng, lat: data.lat };
			this.infoWindow.title = data.towername;
			this.infoWindow.contents = [];
			this.infoWindow.contents.push(
				'线路名称：' + data.linename,
				'线路等级：' + data.vlevel,
				'经度：' + data.lng,
				'纬度：' + data.lat
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
.three_dot_view {
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
}
</style>
