<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :roles="roles" :model="temp" label-position="right" label-width="100px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="咨询人姓名" prop="consultName">
            <el-input v-model="temp.consultName" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="咨询人性别" prop="consultSex">
            <el-radio-group v-model="temp.consultSex">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="咨询人电话" prop="consultPhone">
            <el-input v-model="temp.consultPhone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="咨询方式" prop="consultWay">
            <el-select v-model="temp.consultWay" placeholder="请选择">
              <el-option
                v-for="(value, key) in consultWay"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="咨询意向" prop="intention">
            <el-input v-model="temp.intention" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="媒介渠道" prop="mediaType">
            <el-select v-model="temp.mediaType" placeholder="请选择">
              <el-option
                v-for="(value, key) in mediaType"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="咨询时间" prop="consultTime">
            <el-input v-model="temp.consultTime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="与老人关系" prop="personConsultRela">
            <el-select v-model="temp.personConsultRela" placeholder="请选择">
              <el-option
                v-for="(value, key) in consultRela"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="老人姓名" prop="personName">
            <el-input v-model="temp.personName" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="老人性别" prop="personSex">
            <el-radio-group v-model="temp.personSex">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="老人电话" prop="personPhone">
            <el-input v-model="temp.personPhone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="老人身份证" prop="personIdcard">
            <el-input v-model="temp.personIdcard" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-form-item label="咨询内容" prop="content">
          <el-input v-model="temp.content" clearable />
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/consultation'

export default {
  name: 'ConsultationForm',
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
        consultWay: '',
        content: '',
        consultName: '',
        consultPhone: '',
        consultAddress: '',
        consultSex: '',
        mediaType: '',
        intention: '',
        consultTime: '',
        personName: '',
        personConsultRela: '',
        personPhone: '',
        personIdcard: '',
        personBirthday: '',
        personSex: ''
      },
      mediaType: {
        internet: '互联网',
        acquaintances: '熟人介绍',
        traditional: '传统媒体',
        relatives: '亲友介绍',
        other: '其他'
      },
      consultWay: {
        dialed_call: '去电',
        arrive_visit: '来访',
        incoming_call: '来电'
      },
      consultRela: {
        father_son: '父子',
        oneself: '本人',
        mother_son: '母子',
        father_daughter: '父女',
        mother_daughter: '母女',
        brotherhood: '兄弟',
        brother_sister: '兄妹',
        sisterhood: '姐妹',
        sister_brother: '姐弟',
        marriage_bonds: '夫妻',
        other: '其他'
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
        consultWay: '',
        content: '',
        consultName: '',
        consultPhone: '',
        consultAddress: '',
        consultSex: '',
        mediaType: '',
        intention: '',
        consultTime: '',
        personName: '',
        personConsultRela: '',
        personPhone: '',
        personIdcard: '',
        personBirthday: '',
        personSex: ''
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
