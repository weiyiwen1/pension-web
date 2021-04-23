<template>
  <el-dialog :title="textMap[dialogStatus]" :modal="false" :visible.sync="dialogFormVisible" width="30%">
    <el-form ref="dataForm" :roles="roles" :model="temp" label-position="left" label-width="100px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <el-form-item label="请假开始时间">
        <el-date-picker v-model="temp.leaveTime" type="date" :disabled="dialogStatus==='back'" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="预计请假天数">
        <el-input v-model="temp.expectDays" :disabled="dialogStatus==='back'" clearable />
      </el-form-item>
      <el-form-item label="销假时间">
        <el-date-picker v-model="temp.backTime" type="date" :disabled="dialogStatus!=='back'" placeholder="选择日期" @change="backTimeChange" />
      </el-form-item>
      <el-form-item v-if="temp.status==='leaving'" label="预计请假天数">
        <el-input v-model="temp.realDays" clearable />
      </el-form-item>
      <el-form-item label="请假原因">
        <el-input v-model="temp.reason" type="textarea" :disabled="dialogStatus==='back'" :rows="4" placeholder="请输入内容" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">{{ textMap[dialogStatus] }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/leave'
import { dateDiff } from '@/utils'

export default {
  name: 'LeaveForm',
  props: {
    checkinNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      dialogStatus: '',
      textMap: {
        apply: '请假申请',
        confirm: '确认请假',
        back: '销假'
      },
      temp: {
        id: '',
        checkinNo: '',
        leaveTime: '',
        expectDays: '',
        realDays: 0,
        backTime: '',
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
        leaveTime: '',
        expectDays: '',
        realDays: 0,
        backTime: '',
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
    backTimeChange(val) {
      this.temp.realDays = dateDiff(val, new Date(this.temp.leaveTime))
    },
    handleConfirm(id) {
      this.dialogStatus = 'confirm'
      this.dialogFormVisible = true
      const _this = this
      getInfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp = response.data
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleReportBack(id) {
      this.dialogStatus = 'back'
      this.dialogFormVisible = true
      const _this = this
      getInfo(id).then(response => {
        if (response.code === 20000) {
          _this.temp = response.data
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
          if (this.dialogStatus === 'apply') {
            this.temp.status = 'apply'
          } else if (this.dialogStatus === 'confirm') {
            this.temp.status = 'leaving'
          } else if (this.dialogStatus === 'back') {
            this.temp.status = 'returned'
          }
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
