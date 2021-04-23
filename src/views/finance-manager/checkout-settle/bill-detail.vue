<template>
	<div>
		<el-row>
			<el-col :span="18">
				<div slot="header" class="clearfix">
					<span>已执行费用</span>
				</div>
				<div class="filter-container">
					<el-form :inline="true" :model="listQuery" class="form-inline">
						<el-form-item label="">
							<el-date-picker v-model="queryDate" type="daterange" align="left" unlink-panels range-separator="至"
							 start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
						</el-form-item>
						<el-form-item>
							<el-button v-waves type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
						</el-form-item>
					</el-form>
				</div>
				<!-- 表格 -->
				<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
					<el-table-column label="收费项目" min-width="110px" align="left">
						<template slot-scope="scope">
							{{ scope.row.name }}
						</template>
					</el-table-column>
					<el-table-column label="价格" width="80px" align="left">
						<template slot-scope="scope">
							{{ scope.row.price }}
						</template>
					</el-table-column>
					<el-table-column label="数量" width="80px" align="left">
						<template slot-scope="scope">
							{{ scope.row.quantity }}
						</template>
					</el-table-column>
					<el-table-column label="金额" width="80px" align="left">
						<template slot-scope="scope">
							{{ scope.row.amount }}
						</template>
					</el-table-column>
					<el-table-column label="费用日期" width="120px" align="left">
						<template slot-scope="scope">
							{{ formatDate(scope.row.startDate, 'yyyy-MM-dd') }}
						</template>
					</el-table-column>
					<el-table-column label="执行时间" width="160px" align="left">
						<template slot-scope="scope">
							{{ scope.row.createTime }}
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<div class="pagination-container">
					<el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize"
					 :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
					 @current-change="handleCurrentChange" />
				</div>
			</el-col>
			<el-col :span="6">
				<div style="width:100%;padding-left:15px;margin-top:53px;">
					<div class="unsettle-title">费用统计</div>
					<el-table :data="statisticsList" border show-summary style="width: 100%" :header-cell-style="{backgroundColor: '#F5F7FD', color: '#606266'}">
						<el-table-column prop="name" label="统计类别" min-width="100" align="center" />
						<el-table-column prop="amount" label="金额" min-width="100" align="center"/>
					</el-table>
				</div>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取消</el-button>
			<el-button :loading="btnLoading" type="primary" @click="refund()">确认退费</el-button>
		</div>
	</div>
</template>

<script>
	import {
		findPage,
		statisticsByCheckinNo
	} from '@/api/billdetail'
	import {
		findByOrg as findChargeType
	} from '@/api/chargetype'
	import {
		pickerOptions,
		formatDate
	} from '@/utils'
	import waves from '@/directive/waves'
	import {
		getMonth
	} from '@/utils'

	export default {
		name: 'RefundForm',
		directives: {
			waves
		},
		props: {
			checkinNo: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				btnLoading: false,
				tableKey: 0,
				list: null,
				statisticsList: [],
				total: null,
				selectedRows: null,
				listLoading: false,
				dialogFormVisible: false,
				pickerOptions: pickerOptions,
				queryDate: [getMonth('s', 0), getMonth('e', 0)],
				typeMap: {},
				typeList: [],
				listQuery: {
					page: 1,
					psize: 10,
					checkinNo: '',
					startDate: '',
					endDate: ''
				},
				chargeIntervalMap: {
					once: '一次性',
					day: '天',
					month: '月'
				},
				roles: {
					name: [{
						required: true,
						message: '名称必填',
						trigger: 'blur'
					}]
				}
			}
		},
		computed: {},
		watch: {
			dialogFormVisible: function() {
				this.resetTemp()
			}
		},
		created() {},
		destroyed() {

		},
		methods: {
			resetTemp() {
				this.listQuery = {
					page: 1,
					psize: 10,
					checkinNo: '',
					startDate: '',
					endDate: ''
				}
			},
			findChargeType() {
				findChargeType().then(response => {
					this.typeList = response.data
					if (this.typeList.length > 0) {
						for (let i = 0; i < this.typeList.length; i++) {
							const type = this.typeList[i]
							this.typeMap[type.id] = type.name
						}
					}
				})
			},
			fetchList() {
				this.listLoading = true
				if (this.queryDate.length > 1) {
					this.listQuery.startDate = this.queryDate[0]
					this.listQuery.endDate = this.queryDate[1]
				}
				this.listQuery.checkinNo = this.checkinNo
				findPage(this.listQuery).then(response => {
					this.list = response.data.list
					this.total = response.data.totalRow
					this.listLoading = false
				})
			},
			fetchSatisticsList() {
				if (this.queryDate.length > 1) {
					this.listQuery.startDate = this.queryDate[0]
					this.listQuery.endDate = this.queryDate[1]
				}
				this.listQuery.checkinNo = this.checkinNo
				statisticsByCheckinNo(this.listQuery).then(response => {
					this.statisticsList = response.data
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
					startDate: '',
					endDate: ''
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
			formatDate(date, format) {
				if (!date) {
					return ''
				}
				return formatDate(new Date(date), format)
			},
			chargeIntervalFormatter(val) {
				return this.chargeIntervalMap[val.chargeInterval]
			},
			typeFormatter(val) {
				return this.typeMap[val.chargeTypeId]
			},
			handleBillDetail(id) {
				this.dialogFormVisible = true
				this.findChargeType()
				this.fetchList()
				this.fetchSatisticsList()
			}
		}
	}
</script>

<style>
	.unsettle-title {
		font-size: 14px;
		color: #606266;
		line-height: 43px;
		text-align: center;
		border: 1px solid #dfe6ec;
		border-bottom: 0;
	}
</style>
