<template>
	<div class="app-container">
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
						<el-input style="width: 100px; " v-model="checkinRecord.idcard" :readonly="true" class="enterpriseName">
						</el-input>
					</div>

					<div class="input-wapper">
						<span class="type">护理等级:</span>
						<el-input style="width: 100px;" v-model="checkinRecord.nursingLevelName" :readonly="true" class="enterpriseName">
						</el-input>
					</div>
					<!-- 未修改变量名（入住时间，入住天数） -->
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
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label='退住结算' name="0">
						<el-alert v-if="checkinRecord.status==='already_check_out'" title="当前入住记录已进行退住结算，请通过结算记录查看结果" type="warning"
						 class="el-alert-warning-dark" style="width:760px;margin-top:15px;" />
						<el-alert v-if="checkinRecord.status==='already_check_in' || checkinRecord.status==='checkout_apply'" title="当前入住记录未确认退住不能进行退住结算"
						 type="warning" class="el-alert-warning-dark" style="width:760px;margin-top:15px;" />
						<el-form :inline="true" class="form-inline" style="margin-top:15px">
							<el-row style="width:860px">
								<el-col :span="12" style="min-width: 350px;">
									<div class="form-wapper">
										<div class="form-title">结算信息</div>
										<div class="form-item-wapper" style="min-height:400px;">
											<div class="form-item"><label>余额</label><span>{{ checkinAccount.balance }}</span></div>
											<div class="form-item"><label>结算金额</label><span class="text-red">{{ totalAmount }}</span></div>
											<div class="form-item"><label>补缴</label><span class="text-red">{{ conscienceMoney }}</span></div>
											<div class="form-item"><label>退找</label><span class="text-red">{{ refundMoney }}</span></div>
											<div class="form-item"><label>备注</label>
												<span style="width:270px">
													<el-input v-model="remark" type="textarea" :rows="2" placeholder="请输入内容" />
												</span>
											</div>
											<div class="settle-btn-wapper">
												<el-button type="primary" :disabled="settleButtonDisabled" @click="confirmSettle">确认结算</el-button>
											</div>
										</div>
									</div>
								</el-col>
								<el-col :span="12" style="min-width: 350px;">
									<div style="padding-left:15px">
										<div class="unsettle-title">未结算费用</div>
										<el-table :data="list" border show-summary style="width: 100%; min-height: 422px;" :header-cell-style="{backgroundColor: '#F5F7FD', color: '#606266'}">
											<el-table-column prop="name" label="统计类别" min-width="182" align="center"/>
											<el-table-column prop="amount" label="金额" min-width="182" align="center" />
										</el-table>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</el-tab-pane>
					<el-tab-pane label="结算记录" name="1">
						<settleRecordForm ref="formSettleRecord" :checkin-no="checkinRecord.checkinNo" />
					</el-tab-pane>
					<el-tab-pane label='交款记录' name="2">
						<accountRecordForm ref="formAccountRecord" :checkin-no="checkinRecord.checkinNo" />
					</el-tab-pane>
					<el-tab-pane label='费用明细' name="3">
						<billDetailForm ref="formBillDetail" :checkin-no="checkinRecord.checkinNo" />
					</el-tab-pane>
				</el-tabs>


			</el-col>
		</el-row>
		<selectCheckoutForm ref="formSelectCheckout" @selectCheckout="selectCheckout" />
	</div>
</template>

<script>
	import {
		getByCheckinNo
	} from '@/api/checkin'
	import {
		getUnSettleCheckout,
		confirmCheckoutSettle
	} from '@/api/bill'
	import selectCheckoutForm from './select-checkout'
	import settleRecordForm from './settle-record'
	import accountRecordForm from './account-record'
	import billDetailForm from './bill-detail'
	import waves from '@/directive/waves'
	import {
		pickerOptions
	} from '@/utils'

	export default {
		name: 'RefundManager',
		components: {
			selectCheckoutForm,
			settleRecordForm,
			accountRecordForm,
			billDetailForm
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
				selectedRows: null,
				listLoading: false,
				showSearch: false,
				activeName: '0',
				checkinQuery: {
					checkinNo: ''
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
				checkinStatus: {
					checking_in: '正在办理入住',
					already_check_in: '在住',
					checkout_apply: '办理退住',
					unsettled_accounts: '退住未结算',
					already_check_out: '退住'
				},
				totalAmount: 0,
				conscienceMoney: 0,
				refundMoney: 0,
				remark: '',
				checkinAccount: {

				},
				settleButtonDisabled: true,
				buttonDisabled: true,
				deleting: false,
				pickerOptions: pickerOptions,
				currentIndex: -1,
				roles: {
					remark: [{
						required: true,
						message: '备注必填',
						trigger: 'blur'
					}]
				}
			}
		},
		watch: {},
		created() {},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
				if (tab.name == '1') {
					this.$refs.formSettleRecord.handleSettleRecord();
				} else if (name == '2') {
					this.$refs.formAccountRecord.handleAccountRecord();
				} else if (tab.name == '3') {
					this.$refs.formBillDetail.handleBillDetail();
				}
			},
			checkinNoChange(val) {
				this.checkinQuery.checkinNo = val
				this.checkinRecord = {
					checkinNo: this.checkinQuery.checkinNo,
					name: '',
					bedName: '',
					nursingLevelName: ''
				}
				this.totalAmount = 0
				this.conscienceMoney = 0
				this.refundMoney = 0
				this.remark = ''
				this.checkinAccount = {}
				this.getByCheckinNo()
			},
			getByCheckinNo() {
				getByCheckinNo(this.checkinQuery.checkinNo).then(response => {
					if (response.data) {
						this.checkinRecord = response.data
						this.checkinRecord.statusName = this.checkinStatus[this.checkinRecord.status]
						this.getUnSettleCheckout()
					}
				})
			},
			getUnSettleCheckout() {
				this.listLoading = true
				getUnSettleCheckout(this.checkinRecord.checkinNo).then(response => {
					this.list = response.data.statisticsList
					this.checkinAccount = response.data.checkinAccount
					for (let i = 0; i < this.list.length; i++) {
						this.totalAmount += this.list[i].amount
					}
					if (this.checkinAccount.balance > this.totalAmount) {
						this.refundMoney = this.checkinAccount.balance - this.totalAmount
					} else {
						this.conscienceMoney = this.totalAmount - this.checkinAccount.balance
					}
					this.listLoading = false
					if (this.checkinRecord.status === 'checkout_apply' || this.checkinRecord.status === 'unsettled_accounts') {
						this.settleButtonDisabled = false
					}
				})
			},
			handleSelectCheckout() {
				this.$refs.formSelectCheckout.handleSelectCheckout()
			},
			handleSettleRecord() {
				this.$refs.formSettleRecord.handleSettleRecord()
			},
			handleAccountRecord() {
				this.$refs.formAccountRecord.handleAccountRecord()
			},
			handleBillDetail() {
				this.$refs.formBillDetail.handleBillDetail()
			},
			selectCheckout(row) {
				this.checkinRecord = row
				this.checkinRecord.statusName = this.checkinStatus[this.checkinRecord.status]
				this.getUnSettleCheckout()
			},
			confirmSettle() {
				this.btnLoading = true
				confirmCheckoutSettle(this.checkinRecord.checkinNo).then(response => {
					if (response.code === 20000) {
						this.settleButtonDisabled = true
						this.checkinRecord.stauts = response.data.checkinRecord.status
						this.$message.success(response.message)
					} else {
						this.$message.error(response.message)
					}
					this.btnLoading = false
				}).catch(() => {
					this.btnLoading = false
				})
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.el-table__fixed {
	  height: 100% !important; 
	    }
	.el-tabs__active-bar{
		height: 5px;
	}
	.el-tabs__item{	
	}
	.el-tabs__item.is-active{
	color: black;
	font-size: medium;
	font-weight: bold;
	}
	.el-table-column {
		background-color: #F5F7FD;
		min-height: 30px;
		font-size: 15px;
		color: black;
	}

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

	.el-alert-warning-dark {
		background-color: #e6a23c;
		color: #fff;
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

	.form-wapper {
		font-size: 14px;
		color: #606266;
		border: 1px solid #dfe6ec;
	}

	.form-title {
		line-height: 43px;
		text-align: center;
		border-bottom: 1px solid #dfe6ec;
		background-color: #F5F7FD;
		color: #3EA0FF;
	}

	.unsettle-title {
		font-size: 14px;
		color: #606266;
		line-height: 43px;
		text-align: center;
		border: 1px solid #dfe6ec;
		border-bottom: 0;
		background-color: #F5F7FD;
		color: #3EA0FF;
	}

	.form-item-wapper {
		width: 100%;
	}

	.form-item {
		width: 100%;
		display: block;
		margin-top: 20px;
	}

	.form-item label {
		vertical-align: top;
		display: inline-block;
		width: 90px;
		padding-right: 12px;
		text-align: right;
		line-height: 40px;
	}

	.form-item span {
		display: inline-block;
		width: 100px;
		text-align: left;
		line-height: 40px;
	}

	.settle-btn-wapper {
		width: 100%;
		text-align: left;
		padding: 10px;
		margin-top: 20px;
	}

	.text-red {
		color: red;
		cursor: pointer;
	}
</style>
