<template>
	<div class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="缴款退款" name="first">
				<el-row>
					<el-col :span="5" style="padding-right:10px;">
						<el-card class="back" shadow="never">
							<div class="input-wapper" style="margin: 20px 0px 30px 0px;">
								<span style="font-size: 20px;">入住人</span>
								<el-button style="float: right; padding: 7px;" type="primary" plain>选择</el-button>
							</div>
							<div class="input-wapper">
								<span class="type">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</span>
								<el-input style="width: 100px;" v-model="checkinRecord.name" :readonly="true" class="enterpriseName">
								</el-input>
							</div>
							<div class="input-wapper">
								<span class="type">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
								<el-input style="width: 100px;" v-model="checkinRecord.gender==1?'男' : checkinRecord.gender==2?'女' : ' '"
								 :readonly="true" class="enterpriseName">
								</el-input>
								<!-- <span class="sizes">{{checkinRecord.gender | genderFilter }}</span> -->
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
								<el-input style="width: 100px; " v-model="checkinRecord.idcard" :readonly="true" class="enterpriseName">
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
								<el-input style="width: 113px;" v-model="checkinRecord.checkinDate" value :readonly="true" class="enterpriseName">
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
										<el-button align="right" type="primary" size="small" @click="handlePayment"><span>&nbsp;&nbsp;</span>缴款<span>&nbsp;&nbsp;</span></el-button>
									</el-form-item>
								</div>
							</el-form>
						</div>
						<!-- 表格 -->
						<el-table :key="tableKey" v-loading="checkinListLoading" :data="checkinList" border fit highlight-current-row
						 style="width: 100%;" :header-cell-style="{backgroundColor: '#F5F7FD', color: '#3B3B3B'}">
							<el-table-column type="selection" min-width="55px" align="center" />
							<el-table-column label="缴款编号" min-width="115px" align="center">
								<template slot-scope="scope">
									{{ scope.row.payNo }}
								</template>
							</el-table-column>
							<el-table-column label="类型" min-width="115px" align="center">
								<template slot-scope="scope">
									{{ operateTypeMap[scope.row.operateType] }}
								</template>
							</el-table-column>
							<el-table-column label="付款方式" min-width="115px" align="center">
								<template slot-scope="scope">
									{{ paymentWayMap[scope.row.paymentWayId] }}
								</template>
							</el-table-column>
							<el-table-column label="金额" min-width="115px" align="center">
								<template slot-scope="scope">
									{{ scope.row.amount }}
								</template>
							</el-table-column>
							<el-table-column label="操作人" min-width="115px" align="center">
								<template slot-scope="scope">
									{{ scope.row.createName }}
								</template>
							</el-table-column>
							<el-table-column label="备注" min-width="147px" align="center">
								<template slot-scope="scope">
									{{ scope.row.remarks }}
								</template>
							</el-table-column>
							<el-table-column label="操作" align="center" min-width="165px" class-name="small-padding">
								<template slot-scope="scope">
									<el-tooltip content="打印" placement="top">
										<el-button v-waves type="primary" size="mini" @click="handlePrint(scope.$index,scope.row.id)">打印</el-button>
									</el-tooltip>
									<el-tooltip v-if="scope.row.refundFlag==='0' && scope.row.expendFlag==='0'" content="退款" placement="top">
										<el-button v-waves :loading="scope.row.delete" type="danger" size="mini" @click="handleRefund(scope.$index,scope.row.id)">退款</el-button>
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>

						<!-- 表单 -->
						<paymentForm ref="formPayment" :checkin-no="checkinQuery.checkinNo" :payment-way="paymentWay" @updateRow="updateRow" />
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="缴款查询" name="second">
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
				表格
				<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
				 :header-cell-style="{backgroundColor: '#F5F7FD', color: '#3B3B3B'}">
					<el-table-column label="入住号" min-width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.checkinNo }}
						</template>
					</el-table-column>
					<el-table-column label="姓名" min-width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.personName }}
						</template>
					</el-table-column>
					<el-table-column label="缴款编号" min-width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.payNo }}
						</template>
					</el-table-column>
					<el-table-column label="类型" min-width="110px" align="center">
						<template slot-scope="scope">
							{{ operateTypeMap[scope.row.operateType] }}
						</template>
					</el-table-column>
					<el-table-column label="付款方式" min-width="110px" align="center">
						<template slot-scope="scope">
							{{ paymentWayMap[scope.row.paymentWayId] }}
						</template>
					</el-table-column>
					<el-table-column label="金额" min-width="110px" align="center">
						<template slot-scope="scope">
							{{ scope.row.amount }}
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
					<el-table-column label="操作" align="center" min-width="150px" class-name="small-padding">
						<template slot-scope="scope">
							<el-tooltip content="打印" placement="top">
								<el-button v-waves type="primary" size="mini" @click="handleUpdate(scope.$index,scope.row.id)">打印</el-button>
							</el-tooltip>
							<el-tooltip v-if="scope.row.refundFlag==='0'" content="退款" placement="top">
								<el-button v-waves :loading="scope.row.delete" type="danger" size="mini" :v-if="scope.row.operateType === 'payin'"
								 @click="handleDelete(scope.$index,scope.row.id)">退款</el-button>
							</el-tooltip>
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
		findListByCheckinNo,
		findPage
	} from '@/api/account-record'
	import {
		getByCheckinNo
	} from '@/api/checkin'
	import {
		findByOrg as findPaymentWay
	} from '@/api/payment-way'
	import waves from '@/directive/waves'
	import {
		pickerOptions,
		getMonth
	} from '@/utils'
	import paymentForm from './account-payment'

	export default {
		name: 'AccountRecord',
		components: {
			paymentForm
		},
		directives: {
			waves
		},

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
				paymentWay: [],
				paymentWayMap: {},
				checkinQuery: {
					checkinNo: '',
					endDate: '',
					startDate: ''
				},
				options: [{
					value: '选项1',
					label: '现金'
				}, {
					value: '选项2',
					label: '微信'
				}, {
					value: '选项3',
					label: '支付宝'
				}],
				value: '',
				selesctCheckinDateRange: [getMonth('s', 0), getMonth('e', 0)],
				selesctDateRange: [getMonth('s', 0), getMonth('e', 0)],
				listQuery: {
					checkinNo: '',
					endDate: '',
					startDate: ''
				},
				operateTypeMap: {
					payin: '缴款存入',
					refund: '退款取出',
					deductions: '费用扣除',
					restitution: '退费返还'
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
		created() {
			this.findPaymentWay()
		},
		filters: {
		    genderFilter(gender) {
		      const genderMap = {
		        1: '男',
		        2: '女'
		      }
		      return genderMap[gender]
		    }
			},
		computed: {
			genderGet:{
				genderFilter(gender) {
				  const genderMap = {
				    1: '男',
				    2: '女'
				  }
				  return genderMap[gender]
				}
			}
		},
		methods: {
			
			handleClick(tab, event) {
				console.log(tab, event)
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
			fetchCheckinList() {
				this.checkinListLoading = true
				this.checkinQuery.startDate = this.selesctCheckinDateRange[0]
				this.checkinQuery.endDate = this.selesctCheckinDateRange[1]
				findListByCheckinNo(this.checkinQuery).then(response => {
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
				this.listQuery.endDate = this.selesctDateRange[0]
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
					sort: 0,
					name: ''
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
			handlePayment() {
				this.$refs.formPayment.handlePayment()
			},
			handlePring(id) {

			},
			handleRefund(index, id) {
				this.$refs.formPayment.handleRefund(id)
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
		border-color: #F5F7FD;
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
