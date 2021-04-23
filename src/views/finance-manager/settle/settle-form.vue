<template>
  <el-dialog title="账单结算" :visible.sync="dialogFormVisible" width="700px">
    <el-row>
      <el-col :span="12">
        <div class="form-wapper">
          <div class="form-title">结算信息</div>
          <div class="form-item-wapper">
            <div class="form-item"><label>入住号</label><span>{{ checkinRecord.checkinNo }}</span></div>
            <div class="form-item"><label>姓名</label><span>{{ person.name }}</span></div>
            <div class="form-item"><label>余额</label><span>{{ checkinAccount.balance }}</span></div>
            <div class="form-item"><label>结算金额</label><span class="text-red">{{ totalAmount }}</span></div>
          </div>
          <el-form ref="dataForm" :roles="roles" :model="bill" label-position="right" label-width="90px" style="width: 100%;">
            <el-form-item label="备注">
              <el-input v-model="bill.remark" clearable />
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="width:100%;padding-left:15px;">
          <div class="unsettle-title">未结算费用</div>
          <el-table
            :data="statisticsList"
            border
            show-summary
            style="width: 100%"
          >
            <el-table-column prop="name" label="统计类别" width="157" />
            <el-table-column prop="amount" label="金额" width="157" />
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="confirmSettle()">确认结算</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getBill, confirmSettle } from '@/api/bill'

export default {
  name: 'SettleForm',
  props: {
  },
  data() {
    return {
      btnLoading: false,
      totalAmount: 0,
      bill: {},
      person: {},
      checkinAccount: {},
      checkinRecord: {},
      statisticsList: [],
      dialogFormVisible: false,
      roles: {
        remark: [{ required: true, message: '备注必填', trigger: 'blur' }]
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
      this.totalAmount = 0
      this.bill = {}
      this.person = {}
      this.checkinAccount = {}
      this.checkinRecord = {}
      this.statisticsList = []
    },
    handleSettle(id) {
      this.dialogFormVisible = true
      const _this = this
      getBill(id).then(response => {
        if (response.code === 20000) {
          _this.checkinRecord = response.data.checkinRecord
          _this.checkinAccount = response.data.checkinAccount
          _this.person = response.data.person
          _this.bill = response.data.bill
          _this.statisticsList = response.data.statisticsList
          for (let i = 0; i < _this.statisticsList.length; i++) {
            _this.totalAmount += _this.statisticsList[i].amount
          }
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    confirmSettle() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          confirmSettle(this.bill.id).then(response => {
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
    }
  }
}
</script>
<style>
.form-wapper{
  font-size: 14px;
  color:#606266;
  border:1px solid #dfe6ec;
}
.form-title{
  line-height:43px;
  text-align:center;
  border-bottom:1px solid #dfe6ec;
}
.unsettle-title{
  font-size: 14px;
  color:#606266;
  line-height:43px;
  text-align:center;
  border:1px solid #dfe6ec;
  border-bottom:0;
}
.form-item-wapper{
  width:100%;
}
.form-item{
  width:100%;
  display: block;
}
.form-item label{
  vertical-align: top;
  display: inline-block;
  width:90px;
  padding-right:12px;
  text-align:right;
  line-height:40px;
}
.form-item span{
  display: inline-block;
  width:100px;
  text-align:left;
  line-height:40px;
}
.settle-btn-wapper{
  width:100%;
  text-align:right;
  padding:10px;
}
.text-red{
  color: red;
  cursor: pointer;
}
</style>
