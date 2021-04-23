<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 100%; height: 350px;">
      <el-form-item label="单位名称" prop="unitName">
        <el-input v-model="temp.unitName" clearable />
      </el-form-item>
      <el-form-item label="参加人数" prop="joinPeoples">
        <el-input v-model="temp.joinPeoples" clearable />
      </el-form-item>
      <el-form-item label="负责人" prop="headAutograph">
        <el-input v-model="temp.headAutograph" clearable />
      </el-form-item>
      <el-form-item label="联系电话" prop="linkPhone">
        <el-input v-model="temp.linkPhone" clearable />
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker v-model="temp.serviceTime" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="活动内容" prop="serviceContent">
        <el-input v-model="temp.serviceContent" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/service-unit'

export default {
  name: 'ServiceUnitForm',
  data() {
    return {
      btnLoading: false,
      ruleList: [],
      temp: {
        id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
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
        id: ''
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(id) {
      this.dialogStatus = 'update'
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
          const d = this.temp
          save(d).then(response => {
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
