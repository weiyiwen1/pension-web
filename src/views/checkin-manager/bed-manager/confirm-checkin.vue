<template>
  <el-dialog title="确认入住" :visible.sync="dialogFormVisible">

    <el-row>
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 100%; height: 50vh;">
        <el-form-item label="入住时间" prop="checkinDate">
          <el-date-picker
            v-model="checkinDate"
            align="left"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { confirmCheckin } from '@/api/checkin'

export default {
  name: 'CheckinForm',
  props: {
    orgId: {
      type: String,
      default: ''
    },
    checkinNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      dialogFormVisible: false,
      checkinDate: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
  },
  destroyed() {
  },
  methods: {
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.btnLoading = true
      const _this = this
      var d = { orgId: this.orgId, checkinNo: this.checkinNo, checkinDate: this.checkinDate }
      confirmCheckin(d).then(response => {
        if (response.code === 20000) {
          this.$emit('findBedList')
          _this.dialogFormVisible = false
          _this.$message.success(response.message)
        } else {
          _this.$message.error(response.message)
        }
        _this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>
