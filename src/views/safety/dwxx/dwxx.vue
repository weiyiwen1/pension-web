<!-- @format -->

<template>
	<div class="box">
		<!-- 地图 -->
		<div class="left">
			<map-item></map-item>
		</div>
		<div class="right">
			<!-- 时间 -->
			<div>
				<!-- 开始时间 -->
				<div class="date">
					<el-date-picker size="mini" v-model="startDate" type="date" placeholder="开始时间">
					</el-date-picker>
				</div>
				<!-- 结束时间 -->
				<div class="date">
					<el-date-picker size="mini" v-model="endDate" type="endDate" placeholder="结束时间">
					</el-date-picker>
				</div>
			</div>
			<!-- 查询条件 -->
			<div style="padding: 8px">
				<el-checkbox-group v-model="checkedConditions" @change="handleCheckedConditionChange">
					<el-checkbox v-for="condition in conditions" :label="condition" :key="condition">
						<span style="font-size:12px">{{
						condition
					}}</span></el-checkbox>
				</el-checkbox-group>
			</div>
			<!-- chart -->
			<div style="padding: 8px">
				<div style="width: 100%;text-align: center;font-weight: bold">服务工单统计</div>
				<pie-item :optionData="workData"></pie-item>
			</div>
			<div style="padding: 8px">
				<div style="width: 100%;text-align: center;font-weight: bold">服务人员服务状态统计</div>
				<pie-item :optionData="statusData"></pie-item>
			</div>
		</div>
	</div>
</template>
<script>
import MapItem from './MapItem';
import PieItem from './Pie';
export default {
	components: {
		MapItem,
		PieItem,
	},
	props: ['deviceInfo', 'towerlineInfo'],
	data() {
		return {
			startDate: '',
			endDate: '',
			checkedConditions: '',
			conditions: ['新增老人', '服务中人员', '预约服务老人', '微服务人员', '服务中老人', '完成服务老人'],
			workData: [
				{ value: 100, name: '已预约' },
				{ value: 100, name: '待服务' },
				{ value: 100, name: '服务中' },
				{ value: 100, name: '已完成' },
			],
			statusData: [{ value: 100, name: '服务中人员' }, { value: 10, name: '未服务人员' }],
		};
	},
	methods: {
		handleCheckedConditionChange() {},
	},
};
</script>
<style>
.box {
	display: flex;
}
.left {
	width: 70%;
}
.right {
	width: 30%;
	margin-left: 30px;
	flex-direction: column;
}
.date {
	padding: 8px;
}
.el-checkbox {
	width: 30%;
}
</style>
