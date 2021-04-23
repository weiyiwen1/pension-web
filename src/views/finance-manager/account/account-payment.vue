<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
    <el-form ref="dataForm" :roles="roles" :model="temp" label-position="left" label-width="70px" style="width: 500px; height: 300px;">
      <el-form-item label="缴款编号">
        <el-input v-model="temp.payNo" :readonly="true" clearable />
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="temp.paymentWayId" placeholder="请选择">
          <el-option
            v-for="item in paymentWay"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="金额">
        <el-input-number v-if="dialogStatus==='refund'" v-model="temp.amount" clearable :readonly="true" @change="amountChange" />
        <el-input-number v-else v-model="temp.amount" :precision="2" :step="0.01" clearable @change="amountChange" />
      </el-form-item>
      <el-form-item label="金额大写">
        <el-input v-model="temp.amountCaps" :readonly="true" clearable />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="temp.remarks" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="confirm()">确认{{ textMap[dialogStatus] }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, payin, refund } from '@/api/account-record'
import { toChies } from '@/utils'

export default {
  name: 'ChargeTypeForm',
  props: {
    checkinNo: {
      type: String,
      default: ''
    },
    paymentWay: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      btnLoading: false,
      temp: {
        id: '',
        checkinNo: '',
        expendFlag: '',
        operateType: '',
        paymentWayId: '',
        amount: null,
        amountCaps: '',
        accountId: '',
        payNo: '缴款后自动生成',
        refundFlag: '',
        remarks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        refund: '退款',
        payin: '缴款'
      },
      roles: {
        name: [{ required: true, message: '名称必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  watch: {
    dialogFormVisible: function() {
      this.resetTemp()
    }
  },
  created() {
  },
  destroyed() {

  },
  methods: {
    resetTemp() {
      this.temp = {
        id: '',
        checkinNo: '',
        expendFlag: '',
        operateType: '',
        paymentWayId: '',
        amount: null,
        amountCaps: '',
        accountId: '',
        payNo: '缴款后自动生成',
        refundFlag: '',
        remarks: ''
      }
    },
    amountChange(amount) {
      this.temp.amountCaps = toChies(amount)
    },
    handlePayment() {
      this.dialogStatus = 'payin'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleRefund(id) {
      this.dialogStatus = 'refund'
      this.dialogFormVisible = true
      const _this = this
      getInfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp = response.data
          _this.temp.amountCaps = toChies(response.data.amount)
          _this.temp.remarks = '【' + response.data.payNo + '】退款'
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    confirm() {
      if (this.dialogStatus === 'payin') {
        this.payin()
      } else if (this.dialogStatus === 'refund') {
        this.refund()
      }
    },
    payin() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          this.temp.checkinNo = this.checkinNo
          const d = this.temp
          payin(d).then(response => {
            if (response.code === 20000) {
              this.$emit('updateRow', response.data)
              _this.dialogFormVisible = false
              _this.$message.success(response.message)
            } else {
              _this.$message.error(response.message)
            }
            _this.btnLoading = false
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
        }
      })
    },
    refund() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          const id = this.temp.id
          refund(id).then(response => {
            if (response.code === 20000) {
              this.$emit('updateRow', response.data)
              _this.dialogFormVisible = false
              _this.$message.success(response.message)
            } else {
              _this.$message.error(response.message)
            }
            _this.btnLoading = false
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
        }
      })
    },
    handleChange(value) {
      if (value.length) {
        this.temp.parentId = value[value.length - 1]
      }
    }
  }
}
</script>
