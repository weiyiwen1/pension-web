<template>
	<div class="app-container">
		<!-- 搜索 -->
		<div class="filter-container">
			<el-form :inline="true" :model="listQuery" class="form-inline">
				<el-form-item label="账单时间">
					<el-input v-model="queryDate" placeholder="请选择账单日期" style="width:210px" @click.native="handleSelectBillDate">
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button v-waves type="primary" size="small" @click="handleGenerate">生成账单</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!-- 表格 -->
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row :header-cell-style="{backgroundColor: '#F5F7FD', color: '#3B3B3B'}">
			<el-table-column label="结算号" min-width="140px" align="center">
				<template slot-scope="scope">
					{{ scope.row.billNo }}
				</template>
			</el-table-column>
			<el-table-column label="结算类型" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ billType[scope.row.billType] }}
				</template>
			</el-table-column>
			<el-table-column label="结算状态" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ billStatus[scope.row.billStatus] }}
				</template>
			</el-table-column>
			<el-table-column label="姓名" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ scope.row.personName }}
				</template>
			</el-table-column>
			<el-table-column label="入住号" min-width="130px" align="center">
				<template slot-scope="scope">
					{{ scope.row.checkinNo }}
				</template>
			</el-table-column>
			<el-table-column label="入住状态" min-width="110px" align="center">
				<template slot-scope="scope">
					{{ checkinStatus[scope.row.checkinStatus] }}
				</template>
			</el-table-column>
			<el-table-column label="床位" min-width="150px" align="center">
				<template slot-scope="scope">
					{{ scope.row.buildingName + scope.row.floorName + '' + scope.row.bedName }}
				</template>
			</el-table-column>
			<el-table-column v-for="type in typeList" :key="type.id" :label="type.name" style min-width="80px" align="center">
				<template slot-scope="scope">
					{{ scope.row['type'+type.id] }}
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" min-width="200px" class-name="small-padding" align="center">
				<template slot-scope="scope">
					<el-button v-waves type="primary" size="mini" @click="handleDetail(scope.$index,scope.row.id)">详情</el-button>
					<el-button v-show="scope.row.billStatus==='wait_settle'" v-waves type="primary" size="mini" @click="handleSettle(scope.$index,scope.row)">结算</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 表单 -->
		<generateForm ref="formGenerate" @fetchList="fetchList" />
		<selectBillDateForm ref="formSelectBillDate" @handleSelectCharge="handleSelectCharge" />
		<settleForm ref="formSettle" @updateRow="updateRow" />
		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize"
			 :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
			 @current-change="handleCurrentChange" />
		</div>
	</div>
</template>

<script>
	import {
		findSettleList,
		getLastGenerate
	} from '@/api/bill'
	import generateForm from './generate-bill'
	import selectBillDateForm from './select-bill-date'
	import settleForm from './settle-form'
	import waves from '@/directive/waves'
	import {
		pickerOptions,
		formatDate
	} from '@/utils'

	export default {
		name: 'BillSettle',
		components: {
			generateForm,
			selectBillDateForm,
			settleForm
		},
		directives: {
			waves
		},
		filters: {},
		data() {
			return {
				tableKey: 0,
				list: null,
				total: null,
				queryDate: '',
				listLoading: false,
				showSearch: false,
				checkinStatus: {
					checking_in: '正在办理入住',
					already_check_in: '在住',
					checkout_apply: '办理退住',
					unsettled_accounts: '退住未结算',
					already_check_out: '退住'
				},
				billType: {
					normal: '普通结算',
					checkout: '退住结算'
				},
				billStatus: {
					wait_settle: '待结算',
					settled: '已结算',
					canceled: '已取消'
				},
				typeMap: {},
				typeList: [],
				listQuery: {
					selectBillDateId: '',
					startDate: '',
					endDate: ''
				},
				buttonDisabled: true,
				deleting: false,
				pickerOptions: pickerOptions,
				currentRow: {},
				currentIndex: -1
			}
		},
		watch: {},
		created() {
			this.getLastGenerate()
		},
		methods: {
			formatDate(date, format) {
				if (!date) {
					return ''
				}
				return formatDate(new Date(date), format)
			},
			getLastGenerate() {
				getLastGenerate().then(response => {
					this.listQuery.selectBillDateId = response.data.id
					this.listQuery.startDate = response.data.startDate
					this.listQuery.endDate = response.data.endDate
					this.queryDate = formatDate(new Date(response.data.startDate), 'yyyy-MM-dd') + ' 至 ' + formatDate(new Date(
						response.data.endDate), 'yyyy-MM-dd')
					this.fetchList()
				})
			},
			fetchList() {
				this.listLoading = true
				if (this.queryDate.length > 1) {
					this.listQuery.startDate = this.queryDate[0]
					this.listQuery.endDate = this.queryDate[1]
				}
				findSettleList(this.listQuery).then(response => {
					this.list = response.data.list
					this.typeList = response.data.typeList
					if (this.typeList.length > 0) {
						for (let i = 0; i < this.typeList.length; i++) {
							const type = this.typeList[i]
							this.typeMap[type.id] = type.name
						}
					}
					this.listLoading = false
				})
			},
			handleFilter() {
				this.fetchList()
			},
			handleFilterClear() {
				this.listQuery = {
					selectBillDateId: '',
					startDate: '',
					endDate: ''
				}
				this.fetchList()
			},
			handleGenerate() {
				this.$refs.formGenerate.handleGenerate()
			},
			handleSelectBillDate() {
				this.$refs.formSelectBillDate.handleSelectBillDate()
			},
			chargeStatistics(fId) {
				this.dialogFormVisible = true
				this.fetchList(fId)
			},
			handleSelectCharge(row) {
				this.listQuery.selectBillDateId = row.id
				this.listQuery.startDate = row.startDate
				this.listQuery.endDate = row.endDate
				this.queryDate = formatDate(new Date(row.startDate), 'yyyy-MM-dd') + ' 至 ' + formatDate(new Date(row.endDate),
					'yyyy-MM-dd')
				this.fetchList()
			},
			handleDetail(index, id) {

			},
			handleSizeChange(val) {
				this.listQuery.psize = val
				this.fetchList()
			},
			handleCurrentChange(val) {
				this.listQuery.page = val
				this.fetchList()
			},
			handleSettle(index, row) {
				this.currentRow = row
				this.currentIndex = index
				this.$refs.formSettle.handleSettle(row.id)
			},
			updateRow(temp) {
				if (this.currentIndex >= 0 && temp.id) {
					this.currentRow.status = temp.status
					this.list.splice(this.currentIndex, 1, this.currentRow)
				} else {
					if (this.list.length >= 10) {
						this.list.pop()
					}
					this.list.push(temp)
				}
				this.currentIndex = -1
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.text-red {
		color: red;
		cursor: pointer;
	}

	.text-green {
		color: green;
		cursor: pointer;
	}
</style>
