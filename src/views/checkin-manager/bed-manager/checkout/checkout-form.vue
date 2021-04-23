<template>
  <el-dialog :title="textMap[dialogStatus]" :modal="false" :visible.sync="dialogFormVisible" width="30%">
    <el-form ref="dataForm" :roles="roles" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <el-form-item label="退住类型">
        <el-select v-model="temp.checkoutType" placeholder="请选择">
          <el-option v-for="item in checkoutType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="退住时间">
        <el-date-picker v-model="temp.checkoutDate" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="死亡时间">
        <el-date-picker v-model="temp.deathDate" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="退住原因">
        <el-input v-model="temp.reason" type="textarea" :rows="4" placeholder="请输入内容" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">{{ textMap[dialogStatus] }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/checkout'

export default {
  name: 'CheckoutForm',
  props: {
    checkinNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      checkoutType: [{
        label: '正常退住',
        value: 'normal'
      }, {
        label: '死亡退住',
        value: 'death'
      }],
      dialogStatus: '',
      textMap: {
        apply: '申请退住',
        confirm: '确认退住'
      },
      temp: {
        id: '',
        checkinNo: '',
        checkoutType: '',
        checkoutDate: '',
        deathDate: '',
        status: '',
        reason: ''
      },
      dialogFormVisible: false,
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
    },
    temp: {
      handler(newVal, oldVal) {},
      immediate: true,
      deep: true
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
        checkoutType: '',
        checkoutDate: '',
        deathDate: '',
        status: '',
        reason: ''
      }
    },
    handleApply() {
      this.dialogStatus = 'apply'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleConfirm(id) {
      this.dialogStatus = 'confirm'
      this.dialogFormVisible = true
      const _this = this
      getInfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp.id = response.data.id
          _this.temp.orgId = response.data.orgId
          _this.temp.checkinNo = response.data.checkinNo
          _this.temp.checkoutType = response.data.checkoutType
          _this.temp.checkoutDate = response.data.checkoutDate
          _this.temp.deathDate = response.data.deathDate
          _this.temp.status = response.data.status
          _this.temp.reason = response.data.reason
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          this.temp.checkinNo = this.checkinNo
          const d = this.temp
          save(d).then(response => {
            if (response.code === 20000) {
              if (response.data) {
                this.$emit('updateRow', response.data)
              }
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
