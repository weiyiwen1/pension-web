<template>
  <el-dialog :title="textMap[dialogStatus]" :modal="false" :visible.sync="dialogFormVisible" width="30%">
    <el-form ref="dataForm" :roles="roles" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="temp.name" clearable />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="temp.phone" clearable />
      </el-form-item>
      <el-form-item label="是否担保人" prop="guardianFlag">
        <el-switch v-model="temp.guardianFlag" active-value="1" inactive-value="0" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="temp.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="与老人关系" prop="relation">
        <el-select v-model="temp.relation" placeholder="请选择">
          <el-option
            v-for="(value, key) in consultRela"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证" prop="name">
        <el-input v-model="temp.idcard" clearable />
      </el-form-item>
      <el-form-item label="住址" prop="name">
        <el-input v-model="temp.address" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, save } from '@/api/person-relation'

export default {
  name: 'PersonRelationForm',
  props: {
    personId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      temp: {
        id: '',
        personId: '',
        name: '',
        relation: '',
        idcard: '',
        phone: '',
        sex: '',
        address: '',
        guardianFlag: ''
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
        personId: '',
        name: '',
        relation: '',
        idcard: '',
        phone: '',
        sex: '',
        address: '',
        guardianFlag: ''
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
          this.temp.personId = this.personId
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
