<template>
	<div class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="退费" name="first">
				<el-row>
					<el-col :span="5" style="padding-right:10px;">
						<el-card class="back" shadow="never">
							<div class="input-wapper" style="margin: 20px 0px 30px 0px;">
								<span style="font-size: 20px;">入住人</span>
								<el-button style="float: right; padding: 6px" type="primary" plain>选择</el-button>
							</div>
							<div class="input-wapper">
								<span class="type">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</span>
								<el-input style="width: 80px;" v-model="checkinRecord.name" :readonly="true" class="enterpriseName">
								</el-input>
							</div>
							<div class="input-wapper">
								<span class="type">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
								<el-input style="width: 100px;" v-model="checkinRecord.gender==1?'男' : checkinRecord.gender==2?'女' : ' '" :readonly="true" class="enterpriseName">
								</el-input>
							</div>
							<div class="input-wapper">
								<span class="type">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄:</span>
								<el-input style="width: 100px;" v-model="checkinRecord.age" :readonly="true" class="enterpriseName">
								</el-input>
							</div>

							<div class="input-wapper">
								<span class="type">入&nbsp;&nbsp;住&nbsp;&nbsp;号:</span>
								<el-input style="width: 100px;" v-model="checkinRecord.checkinNo" @change="checkinNoChange" class="enterpriseName">
								</el-input>
							</div>
							<div class="input-wapper">
								<span class="type">身份证号:</span>
								<el-input style="width: 100px;" v-model="checkinRecord.idcard" :readonly="true" class="enterpriseName">
								</el-input>
							</div>

							<div class="input-wapper">
								<span class="type">护理等级:</span>
								<el-input style="width: 100px;" v-model="checkinRecord.nursingLevelName" :readonly="true" class="enterpriseName">
								</el-input>
							</div>
							<!-- 入住天数无法使用 -->
							<div class="input-wapper">
								<span class="type">入住时间:</span>
								<el-input style="width: 113px;" v-model="checkinRecord.checkinDate" :readonly="true" class="enterpriseName">
								</el-input>
							</div>
							<div class="input-wapper">
								<span class="type">入住天数:</span>
								<el-input style="width: 100px;" v-model="checkinRecord.checkinDate" :readonly="true" class="enterpriseName">
								</el-input>
							</div>
						</el-card>
					</el-col>
					<el-col :span="0.9">
						<div class="line"></div>
					</el-col>
					<el-col :span="18">
						<div class="father">
							<el-form :inline="true" :model="checkinQuery" class="form-inline">
								<div class="son1">
									<el-form-item label="">
										<el-date-picker v-model="selesctCheckinDateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
										 end-placeholder="结束日期" :picker-options="pickerOptions" />
									</el-form-item>
								</div>
								<div class="son3">
									<el-form-item>
										<el-button v-waves type="primary" icon="el-icon-search" size="small" @click="fetchCheckinList">搜索</el-button>
									</el-form-item>
								</div>
								<div class="son2">
									<el-form-item>
										<el-button align="right" type="primary" size="small" @click="handleRefund"><span>&nbsp;&nbsp;</span>退费<span>&nbsp;&nbsp;</span></el-button>
									</el-form-item>
								</div>
							</el-form>
						</div>
						<!-- 表格 -->
						<el-table :key="tableKey" v-loading="checkinListLoading" :data="checkinList" border fit highlight-current-row
						 style="width: 100%;" :header-cell-style="{backgroundColor: '#F5F7FD', color: '#3B3B3B'}">
							<el-table-column label="收费项目" min-width="110px" align="center">
								<template slot-scope="scope">
									{{ scope.row.name }}
								</template>
							</el-table-column>
							<el-table-column label="类型" min-width="110px" align="center">
								<template slot-scope="scope">
									{{ chargeHandleMap[scope.row.chargeHandle] }}
								</template>
							</el-table-column>
							<el-table-column label="价格" min-width="110px" align="center">
								<template slot-scope="scope">
									{{ scope.row.price }}
								</template>
							</el-table-column>
							<el-table-column label="数量" min-width="110px" align="center">
								<template slot-scope="scope">
									{{ scope.row.quantity }}
								</template>
							</el-table-column>
							<el-table-column label="金额" min-width="110px" align="center">
								<template slot-scope="scope">
									{{ scope.row.amount }}
								</template>
							</el-table-column>
							<el-table-column label="退费时间" min-width="110px" align="center">
								<template slot-scope="scope">
									{{ scope.row.createTime }}
								</template>
							</el-table-column>
							<el-table-column label="操作人" min-width="110px" align="center">
								<template slot-scope="scope">
									{{ scope.row.createName }}
								</template>
							</el-table-column>
							<el-table-column label="备注" min-width="110px" align="center">
								<template slot-scope="scope">
									{{ scope.row.remarks }}
								</template>
							</el-table-column>
						</el-table>

						<!-- 表单 -->
						<refundForm ref="formRefund" :checkin-no="checkinQuery.checkinNo" @fetchCheckinList="fetchCheckinList" />
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="退费查询" name="second">
				<div class="filter-container">
					<el-form :inline="true" :model="listQuery" class="form-inline">
						<el-form-item label="">
							<el-input v-model="listQuery.checkinNo" placeholder="入住号" clearable />
						</el-form-item>
						<el-form-item label="">
							<el-date-picker v-model="selesctDateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
							 end-placeholder="结束日期" :picker-options="pickerOptions" />
						</el-form-item>
						<el-form-item>
							<el-button v-waves type="primary" icon="el-icon-search" size="small" @click="fetchList">搜索</el-button>
						</el-form-item>
					</el-form>
				</div>
				<!-- 表格 -->
				<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"  :header-cell-style="{backgroundColor: '#F5F7FD', color: '#3B3B3B'}">
					<el-table-column label="入住号" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.checkinNo }}
						</template>
					</el-table-column>
					<el-table-column label="姓名" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.personName }}
						</template>
					</el-table-column>
					<el-table-column label="床位" width="130px" align="center">
						<template slot-scope="scope">
							{{ scope.row.buildingName + scope.row.floorName + scope.row.bedName }}
						</template>
					</el-table-column>
					<el-table-column label="护理等级" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.nursingLevelName }}
						</template>
					</el-table-column>
					<el-table-column label="收费项目" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.name }}
						</template>
					</el-table-column>
					<el-table-column label="类型" width="110px" align="center">
						<template slot-scope="scope">
							{{ chargeHandleMap[scope.row.chargeHandle] }}
						</template>
					</el-table-column>
					<el-table-column label="价格" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.price }}
						</template>
					</el-table-column>
					<el-table-column label="数量" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.quantity }}
						</template>
					</el-table-column>
					<el-table-column label="金额" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.amount }}
						</template>
					</el-table-column>
					<el-table-column label="退费时间" width="200px" align="center">
						<template slot-scope="scope">
							{{ scope.row.createTime }}
						</template>
					</el-table-column>
					<el-table-column label="操作人" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.createName }}
						</template>
					</el-table-column>
					<el-table-column label="备注" width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.remarks }}
						</template>
					</el-table-column>
				</el-table>

				<!-- 分页 -->
				<div class="pagination-container">
					<el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize"
					 :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
					 @current-change="handleCurrentChange" />
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import {
		findRefundByCheckinNo,
		findRefundPage
	} from '@/api/billdetail'
	import {
		getByCheckinNo
	} from '@/api/checkin'
	import waves from '@/directive/waves'
	import {
		pickerOptions,
		getMonth
	} from '@/utils'
	import refundForm from './refund-form'

	export default {
		name: 'RefundManager',
		components: {
			refundForm
		},
		directives: {
			waves
		},
		filters: {},
		data() {
			return {
				activeName: 'first',
				tableKey: 0,
				checkinList: null,
				list: null,
				total: null,
				selectedRows: null,
				checkinListLoading: false,
				listLoading: false,
				showSearch: false,
				checkinQuery: {
					checkinNo: '',
					endDate: '',
					startDate: ''
				},
				selesctCheckinDateRange: [getMonth('s', 0), getMonth('e', 0)],
				selesctDateRange: [getMonth('s', 0), getMonth('e', 0)],
				listQuery: {
					page: 1,
					psize: 10,
					checkinNo: '',
					endDate: '',
					startDate: ''
				},
				chargeHandleMap: {
					charge: '收费',
					refund: '退费',
					deductions: '扣除'
				},
				checkinRecord: {
					age: '',
					gender: '',
					checkinNo: '',
					name: '',
					idcard: '',
					nursingLevelName: '',
					checkinDate: '',
					Days: '',
					checkoutDate: ''
				},
				buttonDisabled: true,
				deleting: false,
				pickerOptions: pickerOptions,
				currentIndex: -1
			}
		},
		watch: {},
		created() {},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event)
			},
			fetchCheckinList() {
				this.checkinListLoading = true
				this.checkinQuery.startDate = this.selesctCheckinDateRange[0]
				this.checkinQuery.endDate = this.selesctCheckinDateRange[1]
				findRefundByCheckinNo(this.checkinQuery).then(response => {
					if (response.data) {
						this.checkinList = response.data
					}
					this.checkinListLoading = false
				})
			},
			checkinNoChange(val) {
				this.checkinQuery.checkinNo = val
				this.checkinRecord = {
					checkinNo: this.checkinQuery.checkinNo,
					name: '',
					bedName: '',
					nursingLevelName: ''
				}
				this.getByCheckinNo()
				this.fetchCheckinList()
			},
			getByCheckinNo() {
				getByCheckinNo(this.checkinQuery.checkinNo).then(response => {
					if (response.data) {
						this.checkinRecord = response.data
					}
				})
			},
			fetchList() {
				this.listLoading = true
				this.listQuery.startDate = this.selesctDateRange[0]
				this.listQuery.endDate = this.selesctDateRange[1]
				findRefundPage(this.listQuery).then(response => {
					this.list = response.data.list
					this.total = response.data.totalRow
					this.listLoading = false
				})
			},
			handleFilter() {
				this.listQuery.page = 1
				this.fetchList()
			},
			handleFilterClear() {
				this.listQuery = {
					page: 1,
					psize: 10,
					checkinNo: '',
					endDate: '',
					startDate: ''
				}
				this.fetchList()
			},
			handleSizeChange(val) {
				this.listQuery.psize = val
				this.fetchList()
			},
			handleCurrentChange(val) {
				this.listQuery.page = val
				this.fetchList()
			},
			handleSelectionChange(val) {
				if (val.length > 0) {
					this.buttonDisabled = false
				} else {
					this.buttonDisabled = true
				}
				this.selectedRows = val
			},
			handleRefund() {
				this.$refs.formRefund.handleRefund()
			},
			updateRow(temp) {
				if (this.currentIndex >= 0 && temp.id) {
					this.checkinList.splice(this.currentIndex, 1, temp)
				} else {
					this.checkinList.push(temp)
				}
				this.currentIndex = -1
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.type {
		color: #6C6C6C;
		font-size: 15px;
	}
	.enterpriseName .el-input__inner {
		width: 100%;
		background-color: #F5F7FD;
		text-align: center;
		border-color: #F5F7FD;
	}
	.back {
		background-color: #F5F7FD;
		min-height: 580px;
	}
	.line {
		min-height: 580px;
		width: 2px;
		background-color: #dfe4ed;
		margin-right: 8px;
		align: center;
	}

	.father {
		width: 100%;
		min-height: 40px;
	}

	.son1 {
		min-width: 180px;
		min-height: 40px;
		float: left;
	}

	.son3 {
		min-width: 300px;
		min-height: 40px;
		float: left;
	}

	.son2 {
		min-width: 30px;
		min-height: 40px;
		float: right;
	}

	.text-red {
		color: red;
		cursor: pointer;
	}

	.text-green {
		color: green;
		cursor: pointer;
	}

	.el-card__header {
		padding: 8px 15px;
		font-size: 14px;
	}

	.input-wapper {
		width: 100%;
		margin-bottom: 10px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.input-label {
		display: block;
		text-align: right;
		width: 40px;
		line-height: 24px;
		font-size: 12px;
	}
</style>
