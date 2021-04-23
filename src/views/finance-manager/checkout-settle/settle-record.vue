<template>
	<div>
		<!-- <el-dialog title="结算记录" :visible.sync="dialogFormVisible" :modal="false"> -->

		<!-- 表格 -->
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
		 :header-cell-style="{backgroundColor: '#F5F7FD', color: '#3B3B3B'}">
			<el-table-column label="结算号" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ scope.row.billNo }}
				</template>
			</el-table-column>
			<el-table-column label="结算类型" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ billType[scope.row.billType] }}
				</template>
			</el-table-column>
			<el-table-column label="结算金额" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ scope.row.amount }}
				</template>
			</el-table-column>
			<el-table-column label="结算后余额" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ scope.row.balanceSnapshot }}
				</template>
			</el-table-column>
			<el-table-column label="状态" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ billStatus[scope.row.status] }}
				</template>
			</el-table-column>
			<el-table-column label="结算时间" min-width="100px" align="center">
				<template slot-scope="scope">
					{{ formatDate(scope.row.createTime, "yyyy-MM-dd hh:mm:ss") }}
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="120px" class-name="small-padding">
				<template slot-scope="scope">
					<el-button v-waves :loading="scope.row.detail" size="mini" @click="handleDetail(scope.$index,scope.row)">
						详情
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize"
			 :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
			 @current-change="handleCurrentChange" />
		</div>

		<!-- <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关闭</el-button>
    </div> -->
		<!-- </el-dialog> -->
	</div>
</template>

<script>
	import {
		findPage, getPageByCheckinNo
	} from '@/api/bill'
	import {
		formatDate
	} from '@/utils'
	import waves from '@/directive/waves'

	export default {
		name: 'SettleRecord',
		directives: {
			waves
		},
		filters: {},
		props: {
			checkinNo: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				tableKey: 0,
				list: null,
				total: null,
				listLoading: false,
				btnLoading: false,
				dialogFormVisible: false,
				buttonDisabled: true,
				deleting: true,
				currentIndex: -1,
				listQuery: {
					page: 1,
					psize: 10,
					checkinNo: ''
				},
				billType: {
					normal: '普通结算',
					checkout: '退住结算'
				},
				billStatus: {
					wait_settle: '待结算',
					settled: '已结算',
					canceled: '已取消'
				}
			}
		},
		watch: {},
		created() {},
		methods: {
			formatDate(date, format) {
				if (!date) {
					return ''
				}
				return formatDate(new Date(date), format)
			},
			fetchList() {
				this.listLoading = true
				getPageByCheckinNo(this.listQuery.checkinNo).then(response => {
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
					checkinNo: ''
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
			handleSettleRecord() {
				this.listQuery.checkinNo = this.checkinNo
				this.dialogFormVisible = true
				this.fetchList()
			},
			handleDetail(index, row) {
				this.$emit('selectCheckout', row)
				this.dialogFormVisible = false
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
