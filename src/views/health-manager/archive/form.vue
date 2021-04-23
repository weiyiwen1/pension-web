<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 50vh; overflow-y: scroll;">
      <el-form-item label="名称" prop="name">
        <el-input v-model="temp.name" clearable />
      </el-form-item>
      <el-form-item label="身份证" prop="idcard">
        <el-input v-model="temp.idcard" clearable />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="temp.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
          <el-radio label="9">未知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="temp.mobile" clearable />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="temp.address" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="temp.enabled">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/person'

export default {
  name: 'PersonForm',
  data() {
    return {
      btnLoading: false,
      ruleList: [],
      temp: {
        id: '',
        name: '',
        idcard: '',
        gender: '1',
        mobile: '',
        address: '',
        enabled: 1
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
        id: '',
        name: '',
        enabled: 1
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
          _this.temp.id = response.data.id
          _this.temp.name = response.data.name
          _this.temp.idcard = response.data.idcard
          _this.temp.gender = response.data.gender
          _this.temp.mobile = response.data.mobile
          _this.temp.address = response.data.address
          _this.temp.enabled = response.data.enabled
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
