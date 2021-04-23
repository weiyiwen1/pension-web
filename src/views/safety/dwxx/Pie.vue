<!-- @format -->

<template>
	<div>
		<chart ref="chart1" :options="orgOptions" :auto-resize="true"></chart>
	</div>
</template>
<script>
export default {
	props: {
		optionData: {
			type: [Array, Object],
			default() {
				return [];
			},
		},
		legend: {
			type: Array,
			default() {
				['已预约', '待服务', '服务中', '已完成'];
			},
		},
	},
	data() {
		return {};
	},
	computed: {
		orgOptions() {
			return {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)',
				},
				legend: {
					bottom: 0,
					data: this.legend,
				},
				series: [
					{
						name: '服务工单统计',
						type: 'pie',
						data: this.optionData,
						label: {
							show: false,
							position: 'center',
						},
					},
				],
				color: ['#60F936', '#F7F93D', '#F81E2E', '#F82DE1'],
			};
		},
	},
	methods: {},
};
</script>
<style lang="scss">
.echarts {
	width: 100%;
	height: 150px;
}
</style>
