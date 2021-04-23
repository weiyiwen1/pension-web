<template>
  <el-dialog title="生成账单" :visible.sync="dialogFormVisible" width="500px">
    <el-form ref="dataForm" :roles="roles" :model="temp" label-position="left" label-width="70px" style="width: 100%;">
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="temp.startDate"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="temp.endDate"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="confirmGenerate()">生成</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { generateBill } from '@/api/bill'
import { getMonth } from '@/utils'

export default {
  name: 'NursingLevelForm',
  props: {
    orgId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      temp: {
        startDate: getMonth('s', 0),
        endDate: getMonth('e', 0)
      },
      dialogFormVisible: false,
      dialogStatus: '',
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
        startDate: getMonth('s', 0),
        endDate: getMonth('e', 0)
      }
    },
    handleGenerate() {
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    confirmGenerate() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          this.temp.orgId = this.orgId
          const d = this.temp
          generateBill(d).then(response => {
            if (response.code === 20000) {
              this.$emit('updateRow')
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
