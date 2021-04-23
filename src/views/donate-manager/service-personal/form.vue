<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 100%; height: 450px;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称" prop="fullName">
            <el-input v-model="temp.fullName" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="temp.gender">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
              <el-radio label="9">未知</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="temp.age" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位/学校" prop="unitSchool">
            <el-input v-model="temp.unitSchool" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="从事专业" prop="workStudyMajor">
            <el-input v-model="temp.workStudyMajor" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="爱好/特长" prop="hobbies">
            <el-input v-model="temp.hobbies" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="社会阅历" prop="socialExperience">
            <el-input v-model="temp.socialExperience" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身体状况" prop="healthStatus">
            <el-input v-model="temp.healthStatus" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="服务内容" prop="serviceContent">
            <el-input v-model="temp.serviceContent" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否培训">
            <el-radio-group v-model="temp.isTrain">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="起始时间" prop="startTime">
            <el-date-picker v-model="temp.startTime" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间">
            <el-date-picker v-model="temp.endTime" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系电话" prop="linkPhone">
            <el-input v-model="temp.linkPhone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="志愿者签名" prop="autograph">
            <el-input v-model="temp.autograph" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="temp.remark" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/service-personal'

export default {
  name: 'ServicePersonalForm',
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
