<template>
	<div>
		<!-- 表格 -->
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
			<el-table-column label="缴款编号" width="110px" align="left">
				<template slot-scope="scope">
					{{ scope.row.payNo }}
				</template>
			</el-table-column>
			<el-table-column label="类型" width="110px" align="left">
				<template slot-scope="scope">
					{{ operateTypeMap[scope.row.operateType] }}
				</template>
			</el-table-column>
			<el-table-column label="付款方式" width="110px" align="left">
				<template slot-scope="scope">
					{{ paymentWayMap[scope.row.paymentWayId] }}
				</template>
			</el-table-column>
			<el-table-column label="金额" width="80px" align="left">
				<template slot-scope="scope">
					{{ scope.row.amount }}
				</template>
			</el-table-column>
			<el-table-column label="操作时间" width="160px" align="left">
				<template slot-scope="scope">
					{{ formatDate(scope.row.createTime, 'yyyy-MM-dd hh:mm:ss') }}
				</template>
			</el-table-column>
			<el-table-column label="操作人" width="110px" align="left">
				<template slot-scope="scope">
					{{ scope.row.createName }}
				</template>
			</el-table-column>
			<el-table-column label="备注" width="110px" align="left">
				<template slot-scope="scope">
					{{ scope.row.remarks }}
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

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">关闭</el-button>
		</div>
	</div>
</template>

<script>
	import {
		findPage
	} from '@/api/account-record'
	import {
		findByOrg as findPaymentWay
	} from '@/api/payment-way'
	import {
		formatDate
	} from '@/utils'
	import waves from '@/directive/waves'

	export default {
		name: 'AccountRecord',
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
				listLoading: true,
				btnLoading: false,
				dialogFormVisible: false,
				buttonDisabled: true,
				deleting: false,
				currentIndex: -1,
				listQuery: {
					page: 1,
					psize: 10,
					checkinNo: ''
				},
				paymentWay: [],
				paymentWayMap: {},
				operateTypeMap: {
					payin: '缴款存入',
					checkout_payin: '退住补缴',
					refund: '退款取出',
					checkout_refund: '退住退款',
					deductions: '费用扣除',
					restitution: '退费返还'
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
			findPaymentWay() {
				findPaymentWay().then(response => {
					this.paymentWay = response.data
					if (this.paymentWay.length > 0) {
						for (let i = 0; i < this.paymentWay.length; i++) {
							const payWay = this.paymentWay[i]
							this.paymentWayMap[payWay.id] = payWay.name
						}
					}
				})
			},
			fetchList() {
				this.listLoading = true
				findPage(this.listQuery).then(response => {
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
			handleAccountRecord() {
				this.listQuery.checkinNo = this.checkinNo
				this.dialogFormVisible = true
				this.findPaymentWay()
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
