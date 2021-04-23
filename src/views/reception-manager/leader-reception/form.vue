<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :roles="roles" :model="temp" label-position="right" label-width="100px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="来访单位" prop="unit">
            <el-input v-model="temp.unit" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="来访目的" prop="purp">
            <el-input v-model="temp.purp" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到访时间" prop="receptionDate">
            <el-date-picker v-model="temp.receptionDate" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="来访人员、职务" prop="personnel">
            <el-input v-model="temp.personnel" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来访人数" prop="people">
            <el-input v-model="temp.people" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="陪同人员" prop="escort">
            <el-input v-model="temp.escort" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="陪同人数" prop="escortPeople">
            <el-input v-model="temp.escortPeople" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="事项" prop="prepWork">
            <el-input v-model="temp.prepWork" type="textarea" :rows="4" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="其他要求" prop="otherReq">
            <el-input v-model="temp.otherReq" type="textarea" :rows="4" placeholder="请输入内容" />
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
import { getInfo, save } from '@/api/reception'

export default {
  name: 'ReceptionForm',
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
        id: '',
        type: '1',
        unit: '',
        purp: '',
        receptionDate: '',
        personnel: '',
        people: '',
        escort: '',
        escortPeople: '',
        prepWork: '',
        otherReq: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
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
        type: '1',
        unit: '',
        purp: '',
        receptionDate: '',
        personnel: '',
        people: '',
        escort: '',
        escortPeople: '',
        prepWork: '',
        otherReq: ''
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.pid = []
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
          this.temp.orgId = this.orgId
          const d = this.temp
          save(d).then(response => {
            if (response.code === 20000) {
              if (!d.id) {
                d.id = response.data.id
              }
              this.$emit('updateRow', d)
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
